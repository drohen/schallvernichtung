import {el, mount, setChildren} from "../web_modules/redom.js";
import {RecordBtn} from "./recordBtn.js";
import {RecordBuffer} from "./recordBuff.js";
import {SampleBank} from "./sampleBank.js";
import {SampleSelect} from "./sampleSelect.js";
import {SampleUI} from "./sampleUI.js";
export class Schallvernichtung {
  static init() {
    new Schallvernichtung();
  }
  constructor() {
    this.baseEl = this.getElOrThrow(`#root`);
    const _AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new _AudioContext();
    this.context.suspend();
    const recordLength = 10;
    const chunkSize = 4096;
    this.recordBtn = new RecordBtn(this, recordLength);
    this.recordBuff = new RecordBuffer(this.context.sampleRate, recordLength, chunkSize, this);
    this.processorNode = this.context.createScriptProcessor(chunkSize, 1, 1);
    this.processChunk = this.processChunk.bind(this);
    this.processorNode.addEventListener(`audioprocess`, this.processChunk);
    this.sampleBank = new SampleBank(this, 1);
    this.sampleBlocks = [];
    this.samplesMount = el(`div.samplesMount`);
    this.sampleList = new SampleSelect(this);
    this.setUI();
  }
  getElOrThrow(selector) {
    const el2 = document.querySelector(selector);
    if (!el2) {
      throw Error(`Couldn't find element ${selector}`);
    }
    return el2;
  }
  wrap(inner, label, className) {
    const div = el(`div${className ? `.${className}` : ``}`);
    if (label) {
      const text = el(`p`, label);
      mount(div, text);
    }
    if (Array.isArray(inner)) {
      setChildren(div, inner);
    } else {
      mount(div, inner);
    }
    return div;
  }
  setUI() {
    mount(this.baseEl, this.wrap([this.wrap(this.recordBtn), this.samplesMount], void 0, `controls`));
    mount(this.baseEl, this.sampleList);
  }
  processChunk(event) {
    if (this.recordBuff.isRecording()) {
      this.recordBuff.onChunk(event.inputBuffer.getChannelData(0));
    }
  }
  onRecorded(data) {
    this.sampleBank.create(data);
  }
  async handleStream(stream) {
    this.context.resume();
    this.sourceNode = this.context.createMediaStreamSource(stream);
  }
  onError() {
    this.context.suspend();
    console.error(this.recordBtn.getError());
  }
  async startRecording() {
    this.sourceNode?.connect(this.processorNode);
    this.processorNode.connect(this.context.destination);
    this.recordBuff.record();
  }
  async stopRecording() {
    this.recordBuff.stopRecord();
    this.processorNode.disconnect(this.context.destination);
    this.sourceNode?.disconnect(this.processorNode);
  }
  async reloadContext() {
    this.context.resume();
  }
  async onPlaySample(index) {
    this.sampleBank.play(index);
  }
  async onPauseSample(index) {
    this.sampleBank.pause(index);
  }
  onSampleAdd(index) {
    const block = new SampleUI(this, this.sampleBank.node(index), index);
    this.sampleBlocks.push(block);
    mount(this.samplesMount, block);
    this.sampleList.add(index, this.sampleBank.label(index));
  }
  onLabelChange() {
  }
  onSampleSelected(index, previous) {
    if (previous !== void 0)
      this.sampleBlocks[previous].hide();
    this.sampleBlocks[index].show();
  }
}

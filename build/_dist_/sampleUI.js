import {el, mount} from "../web_modules/redom.js";
import {CompressorControl} from "./compressorCtrl.js";
import {DistortionControl} from "./distortionCtrl.js";
import {LowpassControl} from "./lowpassCtrl.js";
import {PlayBtn} from "./playBtn.js";
import {SpeedControl} from "./speedCtrl.js";
import {VolumeControl} from "./volumeCtrl.js";
var Visibility;
(function(Visibility2) {
  Visibility2[Visibility2["visible"] = 0] = "visible";
  Visibility2[Visibility2["hidden"] = 1] = "hidden";
})(Visibility || (Visibility = {}));
export class SampleUI {
  constructor(core, bufferNode, nodeIndex) {
    this.core = core;
    this.bufferNode = bufferNode;
    this.nodeIndex = nodeIndex;
    this.el = el(`div.hidden`);
    this.playBtn = new PlayBtn(this);
    this.volumeCtrl = new VolumeControl(this.core);
    this.volumeCtrl.connectOutput(this.core.context.destination);
    this.lowpassCtrl = new LowpassControl(this.core);
    this.lowpassCtrl.connectOutput(this.volumeCtrl);
    this.distortionCtrl = new DistortionControl(this.core);
    this.distortionCtrl.connectOutput(this.lowpassCtrl);
    this.compressorCtrl = new CompressorControl(this.core);
    this.compressorCtrl.connectOutput(this.distortionCtrl);
    this.speedCtrl = new SpeedControl(this.core, this.bufferNode);
    mount(this.el, this.wrap(this.playBtn));
    mount(this.el, this.wrap(this.compressorCtrl, `Slide to control compressor`));
    mount(this.el, this.wrap(this.distortionCtrl, `Slide to control distortion`));
    mount(this.el, this.wrap(this.lowpassCtrl, `Slide to control filter`));
    mount(this.el, this.wrap(this.volumeCtrl, `Slide to control volume`));
    mount(this.el, this.wrap(this.speedCtrl, `Slide to control speed`));
    this.state = 1;
  }
  wrap(inner, label) {
    const div = el(`div`);
    if (label) {
      const text = el(`p`, label);
      mount(div, text);
    }
    mount(div, inner);
    return div;
  }
  show() {
    if (this.state === 0)
      return;
    this.state = 0;
    this.el.classList.remove(`hidden`);
  }
  hide() {
    if (this.state === 1)
      return;
    this.state = 1;
    this.el.classList.add(`hidden`);
  }
  async onPlay() {
    this.compressorCtrl.connectInput(this.bufferNode);
    this.core.onPlaySample(this.nodeIndex);
  }
  async onPause() {
    this.compressorCtrl.disconnectInput(this.bufferNode);
    this.core.onPauseSample(this.nodeIndex);
  }
}

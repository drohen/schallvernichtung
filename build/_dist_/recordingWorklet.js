import {RecordBuffer} from "./recordBuff.js";
var WorkletState;
(function(WorkletState2) {
  WorkletState2[WorkletState2["closed"] = 0] = "closed";
  WorkletState2[WorkletState2["initing"] = 1] = "initing";
  WorkletState2[WorkletState2["recording"] = 2] = "recording";
  WorkletState2[WorkletState2["stopped"] = 3] = "stopped";
})(WorkletState || (WorkletState = {}));
export class RecordingWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.state = 0;
    this.handleData = this.handleData.bind(this);
    this.onRecorded = this.onRecorded.bind(this);
    this.port.onmessage = this.handleData;
  }
  handleData({data}) {
    if (this.buffer) {
      switch (data.command) {
        case `start`:
          if (this.state !== 1) {
            throw Error(`Can't start worklet`);
          }
          this.state = 2;
          this.buffer.record();
          break;
        case `stop`:
          if (this.state !== 2) {
            throw Error(`Can't stop worklet`);
          }
          this.state = 3;
          this.buffer.stopRecord();
          break;
        default:
          break;
      }
    }
    switch (data.command) {
      case `close`:
        this.close();
        break;
      case `init`:
        if (this.state !== 0) {
          throw Error(`Can't init worklet`);
        }
        this.state = 1;
        this.buffer = new RecordBuffer(data.data.sampleRate, data.data.maxLength, 128, this);
        this.port.postMessage({message: `ready`});
        break;
      default:
        break;
    }
  }
  close() {
    this.state = 0;
    this.buffer = void 0;
  }
  onRecorded(data) {
    this.state = 3;
    this.port.postMessage({message: `done`}, [data]);
    this.close();
  }
  process(inputs) {
    if (this.buffer && inputs[0] && inputs[0].length && inputs[0][0] && inputs[0][0].length) {
      this.buffer.onChunk(inputs[0][0]);
    }
    return this.state === 2;
  }
}

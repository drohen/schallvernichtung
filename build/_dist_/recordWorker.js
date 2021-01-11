var WorkletState;
(function(WorkletState2) {
  WorkletState2[WorkletState2["closed"] = 0] = "closed";
  WorkletState2[WorkletState2["initing"] = 1] = "initing";
  WorkletState2[WorkletState2["recording"] = 2] = "recording";
  WorkletState2[WorkletState2["stopped"] = 3] = "stopped";
})(WorkletState || (WorkletState = {}));
var BufferState;
(function(BufferState2) {
  BufferState2[BufferState2["preparing"] = 0] = "preparing";
  BufferState2[BufferState2["recording"] = 1] = "recording";
  BufferState2[BufferState2["idle"] = 2] = "idle";
})(BufferState || (BufferState = {}));
export class RecordBuffer {
  constructor(sampleRate, maxLength, chunkSize, handler) {
    this.sampleRate = sampleRate;
    this.maxLength = maxLength;
    this.chunkSize = chunkSize;
    this.handler = handler;
    this.state = 2;
    this.bufferSize = this.sampleRate * this.maxLength;
    this.recordingLength = 0;
    this.buffer = new Float32Array(this.bufferSize);
    this.onChunk = this.onChunk.bind(this);
    this.prepCounter = 0;
  }
  record() {
    if (this.isRecording())
      return;
    this.recordingLength = 0;
    this.state = 1;
  }
  onChunk(chunk) {
    if (this.state === 0) {
      if (this.prepCounter > 10) {
        this.state = 1;
        this.prepCounter = 0;
      } else {
        this.prepCounter += 1;
      }
      return;
    }
    if (chunk[0] === 0 && chunk[1] === 0 && chunk[2] === 0) {
      return;
    }
    this.buffer.set(chunk, this.recordingLength);
    this.recordingLength += chunk.length;
  }
  stopRecord() {
    if (!this.isRecording())
      return;
    this.state = 2;
    this.recordingLength -= this.chunkSize;
    this.handler.onRecorded(this.buffer.subarray(0, this.recordingLength));
  }
  isRecording() {
    return this.state === 1 || this.state === 0;
  }
}
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
          this.port.postMessage({message: `recording`});
          break;
        case `stop`:
          if (this.state !== 2) {
            throw Error(`Can't stop worklet`);
          }
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
    this.port.postMessage({message: `done`, buffer: data}, [data.buffer]);
    this.close();
  }
  process(inputs) {
    if (this.buffer && inputs[0] && inputs[0].length && inputs[0][0] && inputs[0][0].length) {
      this.buffer.onChunk(inputs[0][0]);
    }
    return this.state === 2;
  }
}
if (typeof registerProcessor === `function`) {
  registerProcessor(`recording-worklet`, RecordingWorklet);
} else {
  let encoder;
  const closeWorker = () => {
    encoder = void 0;
    close();
  };
  const bufferHandler = {
    onRecorded: (data) => {
      postMessage({message: `done`, buffer: data}, [data.buffer]);
      closeWorker();
    }
  };
  onmessage = ({data}) => {
    if (encoder) {
      switch (data.command) {
        case `start`:
          encoder.record();
          postMessage({message: `recording`});
          break;
        case `chunk`:
          encoder.onChunk(data.buffer);
          break;
        case `stop`:
          encoder.stopRecord();
          break;
        default:
          break;
      }
    }
    switch (data.command) {
      case `close`:
        closeWorker();
        break;
      case `init`:
        encoder = new RecordBuffer(data.data.sampleRate, data.data.maxLength, data.data.chunkSize, bufferHandler);
        postMessage({message: `ready`});
        break;
      default:
        break;
    }
  };
}

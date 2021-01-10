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

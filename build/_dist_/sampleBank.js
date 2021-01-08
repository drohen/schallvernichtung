var SampleState;
(function(SampleState2) {
  SampleState2[SampleState2["notStarted"] = 0] = "notStarted";
  SampleState2[SampleState2["paused"] = 1] = "paused";
  SampleState2[SampleState2["playing"] = 2] = "playing";
})(SampleState || (SampleState = {}));
export class SampleBank {
  constructor(core, channels) {
    this.core = core;
    this.channels = channels;
    this.samples = [];
  }
  joinEnds(data) {
    const milli = ~~(this.core.context.sampleRate * 0.05);
    for (let i = 0; i < milli; i++) {
      data[i] = data[i] * i / milli;
      data[data.length - 1 - i] = data[data.length - 1 - i] * i / milli;
    }
  }
  create(data) {
    this.joinEnds(data);
    const buffer = this.core.context.createBuffer(this.channels, data.length, this.core.context.sampleRate);
    const node = this.core.context.createBufferSource();
    buffer.copyToChannel(data, 0);
    node.buffer = buffer;
    node.loop = true;
    const index = this.samples.length;
    this.samples.push({
      label: `Sample ${new Date().toUTCString()}`,
      node,
      state: 0
    });
    this.core.onSampleAdd(index);
  }
  play(index) {
    if (this.samples[index].state === 2)
      return;
    const start = this.samples[index].state === 0;
    this.samples[index].state = 2;
    if (start)
      this.samples[index].node.start();
  }
  pause(index) {
    if (this.samples[index].state === 1)
      return;
    this.samples[index].state = 1;
  }
  setLabel(index, label) {
    this.samples[index].label = label;
    this.core.onLabelChange(index);
  }
  setPlaybackSpeed(index, value) {
    this.samples[index].node.playbackRate.linearRampToValueAtTime(value, this.core.context.currentTime + 10);
  }
  node(index) {
    return this.samples[index].node;
  }
  label(index) {
    return this.samples[index].label;
  }
}

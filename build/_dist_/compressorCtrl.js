import {RangeNodeUI} from "./rangeNodeUI.js";
export class CompressorControl extends RangeNodeUI {
  constructor(core) {
    super(`Compressor`, core);
    this.gain = this.core.context.createGain();
    this.node = this.core.context.createDynamicsCompressor();
    this.gain.connect(this.node);
    this.setInput(this.gain);
    this.setOutput(this.node);
    this.gain.gain.setValueAtTime(-1, this.core.context.currentTime);
    this.node.threshold.setValueAtTime(-10, this.core.context.currentTime);
    this.node.knee.setValueAtTime(4, this.core.context.currentTime);
    this.node.ratio.setValueAtTime(2, this.core.context.currentTime);
    this.node.attack.setValueAtTime(0, this.core.context.currentTime);
    this.node.release.setValueAtTime(0.1, this.core.context.currentTime);
  }
  onChange(value) {
    this.ramp(this.gain.gain, this.logRange(value, -1, -1));
    this.ramp(this.node.threshold, 0 - this.logRange(value, 10, 100));
    this.ramp(this.node.knee, this.logRange(value, 4, 40));
    this.ramp(this.node.ratio, this.logRange(value, 2, 20));
    this.ramp(this.node.release, Math.pow(20, -1 * this.logRange(value, 1, 1e3)));
  }
}

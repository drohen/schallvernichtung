import {RangeNodeUI} from "./rangeNodeUI.js";
export class VolumeControl extends RangeNodeUI {
  constructor(core) {
    super(`Volume`, core, `mid`);
    this.node = this.core.context.createGain();
    this.setInput(this.node);
    this.setOutput(this.node);
    this.node.gain.setValueAtTime(this.logRange(51, 0, 3), this.core.context.currentTime);
  }
  onChange(value) {
    this.ramp(this.node.gain, this.logRange(value, 0, 3));
  }
}

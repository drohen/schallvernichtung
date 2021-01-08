import {RangeNodeUI} from "./rangeNodeUI.js";
export class LowpassControl extends RangeNodeUI {
  constructor(core) {
    super(`Lowpass`, core);
    this.node = this.core.context.createBiquadFilter();
    this.setInput(this.node);
    this.setOutput(this.node);
    this.node.frequency.value = 6e3;
    this.node.type = `lowpass`;
  }
  onChange(value) {
    this.ramp(this.node.frequency, 6e3 - this.logRange(value, 0, 5950 * 5e-3) * 200);
  }
}

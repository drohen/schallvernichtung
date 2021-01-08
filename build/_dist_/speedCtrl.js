import {RangeNodeUI} from "./rangeNodeUI.js";
export class SpeedControl extends RangeNodeUI {
  constructor(core, node) {
    super(`Speed`, core);
    this.node = node;
    this.setInput(this.node);
    this.setOutput(this.node);
    this.el.value = `${this.logRange(1, 0.1, 3, true)}`;
  }
  onChange(value) {
    this.ramp(this.node.playbackRate, this.logRange(value, 0.1, 3));
  }
}

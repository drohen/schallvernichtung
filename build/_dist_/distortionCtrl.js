import {RangeNodeUI} from "./rangeNodeUI.js";
export class DistortionControl extends RangeNodeUI {
  constructor(core) {
    super(`Distortion`, core);
    this.node = this.core.context.createWaveShaper();
    this.setInput(this.node);
    this.setOutput(this.node);
    this.node.oversample = `4x`;
    this.curveData = new Float32Array(this.core.context.sampleRate);
    this.curve(0);
    this.node.curve = this.curveData;
  }
  curve(amount) {
    const k = typeof amount === `number` ? amount : 50;
    const deg = Math.PI / 180;
    let x = 0;
    for (let i = 0; i < this.core.context.sampleRate; ++i) {
      x = i * 2 / this.core.context.sampleRate - 1;
      this.curveData[i] = (10 + k) * x * 50 * deg / (Math.PI + k * Math.abs(x));
    }
  }
  onChange(value) {
    this.curve(~~this.logRange(value, 0, 1e4));
    this.node.curve = this.curveData;
  }
}

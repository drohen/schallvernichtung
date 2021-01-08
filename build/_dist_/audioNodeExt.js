export class AudioNodeExtension {
  constructor(id, inputNode, outputNode) {
    this.id = id;
    this.inputNode = inputNode;
    this.outputNode = outputNode;
    this.isExt = true;
  }
  isExtension(node) {
    return `isExt` in node && node.isExt;
  }
  setInput(node) {
    if (this.inputNode) {
      throw Error(`Input node already set for ${this.id}`);
    }
    this.inputNode = node;
  }
  setOutput(node) {
    if (this.outputNode) {
      throw Error(`Output node already set for ${this.id}`);
    }
    this.outputNode = node;
  }
  input() {
    if (!this.inputNode) {
      throw Error(`No input node set for ${this.id}`);
    }
    return this.inputNode;
  }
  output() {
    if (!this.outputNode) {
      throw Error(`No output node set for ${this.id}`);
    }
    return this.outputNode;
  }
  connectInput(node) {
    if (this.isExtension(node)) {
      node.output().connect(this.input());
    } else {
      node.connect(this.input());
    }
  }
  disconnectInput(node) {
    if (this.isExtension(node)) {
      node.output().disconnect(this.input());
    } else {
      node.disconnect(this.input());
    }
  }
  connectOutput(node) {
    if (this.isExtension(node)) {
      this.output().connect(node.input());
    } else {
      this.output().connect(node);
    }
  }
  disconnectOutput(node) {
    if (this.isExtension(node)) {
      this.output().disconnect(node.input());
    } else {
      this.output().disconnect(node);
    }
  }
}

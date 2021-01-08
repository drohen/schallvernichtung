export declare class AudioNodeExtension {
    protected id: string;
    private inputNode?;
    private outputNode?;
    isExt: true;
    constructor(id: string, inputNode?: AudioNode | undefined, outputNode?: AudioNode | undefined);
    private isExtension;
    setInput(node: AudioNode): void;
    setOutput(node: AudioNode): void;
    input(): AudioNode;
    output(): AudioNode;
    connectInput(node: AudioNode | AudioNodeExtension): void;
    disconnectInput(node: AudioNode | AudioNodeExtension): void;
    connectOutput(node: AudioNode | AudioNodeExtension): void;
    disconnectOutput(node: AudioNode | AudioNodeExtension): void;
}
//# sourceMappingURL=audioNodeExt.d.ts.map
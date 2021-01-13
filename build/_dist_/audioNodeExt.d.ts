export interface AudioNodeManagerContext {
    isAudioNodeManaged: true;
    audioNodeManager: AudioNodeManager;
}
export declare class AudioNodeManager {
    private id;
    private inputNode?;
    private outputNode?;
    private inputConnections;
    private outputConnections;
    constructor(id: string, inputNode?: AudioNode | undefined, outputNode?: AudioNode | undefined);
    private isManaged;
    nodeID(): string;
    setInput(node: AudioNode): void;
    setOutput(node: AudioNode): void;
    input(): AudioNode;
    output(): AudioNode;
    connectInput(node: AudioNode | AudioNodeManagerContext): void;
    disconnectInput(node: AudioNode | AudioNodeManagerContext): void;
    disconnectInputByID(id: string): void;
    connectOutput(node: AudioNode | AudioNodeManagerContext): void;
    disconnectOutput(node: AudioNode | AudioNodeManagerContext): void;
    disconnectOutputByID(id: string): void;
}
//# sourceMappingURL=audioNodeExt.d.ts.map
import { AudioNodeManager, AudioNodeManagerContext } from "./audioNodeExt";
import type { AudioContextProvider } from "./recordingHandler";
import type { SampleNodeAudioProvider } from "./sampleNode";
export declare class ContextNode implements AudioNodeManagerContext, AudioContextProvider, SampleNodeAudioProvider {
    isAudioNodeManaged: true;
    audioNodeManager: AudioNodeManager;
    private _context;
    private sourceNode?;
    constructor(nodeID: string);
    context(): AudioContext;
    onError(): void;
    reloadContext(): Promise<void>;
    handleStream(stream: MediaStream): Promise<void>;
    getRecorderNode(): AudioNodeManagerContext;
}
//# sourceMappingURL=contextNode.d.ts.map
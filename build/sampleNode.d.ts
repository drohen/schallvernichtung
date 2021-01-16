import { AudioNodeManager, AudioNodeManagerContext } from "./audioNodeExt";
import { SampleEntity, SampleState, SampleUINodeID } from "./sampleEntity";
export interface SampleNodeAudioProvider {
    context: () => AudioContext;
}
export interface SampleNodeMathProvider {
    exponentialValueInRange: (position: number, min: number, max: number) => number;
}
export declare class SampleNode implements SampleEntity, AudioNodeManagerContext {
    id: string;
    private core;
    private math;
    audioNodeManager: AudioNodeManager;
    isAudioNodeManaged: true;
    isSampleEntity: true;
    private bufferNode;
    private volumeNode;
    private lowpassFilterNode;
    private distortionFilterNode;
    private distortionCurveData;
    private compressorGainNode;
    private compressorFilterNode;
    constructor(id: string, core: SampleNodeAudioProvider, math: SampleNodeMathProvider, data: Float32Array);
    private curve;
    private ramp;
    private rampTime;
    private setCompressor;
    private setDistortion;
    private setLowpass;
    private setSpeed;
    private setVolume;
    onSampleStateChanged(sampleID: string, state: SampleState, previous: SampleState): void;
    onSampleError(error: Error): void;
    onSampleNodeValueChange(sampleID: string, nodeID: SampleUINodeID, value: number): void;
    onSampleSelectedChanged(): void;
    onSampleCreated(): void;
}
//# sourceMappingURL=sampleNode.d.ts.map
import { AudioNodeManager, AudioNodeManagerContext } from "./audioNodeExt";
import { Sample, SampleEntity, SampleState, SampleUINodeID } from "./sampleEntity";
export interface SampleNodeAudioProvider {
    context: () => AudioContext;
}
export interface SampleNodeMathProvider {
    exponentialValueInRange: (position: number, min: number, max: number) => number;
}
export declare class SampleNode implements SampleEntity, AudioNodeManagerContext {
    private core;
    private math;
    id: string;
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
    constructor(core: SampleNodeAudioProvider, math: SampleNodeMathProvider, sample: Sample);
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
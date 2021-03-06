import type { Entity } from "./entity";
export declare enum SampleState {
    notStarted = 0,
    playing = 1,
    paused = 2
}
export declare enum SampleUINodeID {
    distortion = "distortion",
    compressor = "compressor",
    volume = "volume",
    lowpass = "lowpass",
    speed = "speed"
}
export interface SampleEntity extends Entity {
    isSampleEntity: true;
    onSampleCreated: (sample: Sample) => void;
    onSampleStateChanged: (sampleID: string, state: SampleState, previous: SampleState) => void;
    onSampleSelectedChanged: (sampleID: string) => void;
    onSampleNodeValueChange: (sampleID: string, nodeID: SampleUINodeID, value: number) => void;
    onSampleError: (error: Error) => void;
}
export interface Sample {
    id: string;
    data: Float32Array;
    label: string;
    volume: number;
    speed: number;
    compressor: number;
    lowpass: number;
    distortion: number;
}
//# sourceMappingURL=sampleEntity.d.ts.map
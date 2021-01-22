import { RecordingEntity, RecordingState } from "./recordingEntity";
import type { RecordingSystemHandler } from "./recordingHandler";
import type { Sample, SampleEntity, SampleUINodeID } from "./sampleEntity";
export interface CacheHandler {
    createID: () => string;
    emitSample: (sample: Sample) => void;
    onCacheLoaded: () => void;
}
export interface CacheMathProvider {
    getPositionForLogRangeValue: (value: number, min: number, max: number) => number;
}
export declare class Cache implements SampleEntity, RecordingSystemHandler, RecordingEntity {
    id: string;
    private handler;
    isSampleEntity: true;
    isRecordingEntity: true;
    private db;
    private baseSpeed;
    private nodeDebounce;
    constructor(id: string, handler: CacheHandler, math: CacheMathProvider);
    private loadCache;
    onSampleNodeValueChange(sampleID: string, nodeID: SampleUINodeID, value: number): void;
    onRecorded(data: Float32Array): void;
    onRecordingStateChanged(state: RecordingState): void;
    onRecordingError(error: Error): void;
    onSampleError(): void;
    onSampleSelectedChanged(): void;
    onSampleCreated(): void;
    onSampleStateChanged(): void;
}
//# sourceMappingURL=cache.d.ts.map
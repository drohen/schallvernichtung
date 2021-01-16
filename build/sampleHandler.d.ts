import type { SampleSelectHandler } from "./uiSampleSelect";
import type { UISampleHandler } from "./uiSample";
import type { Entity } from "./entity";
import { SampleUINodeID } from "./sampleEntity";
export interface SampleSystemCoreProvider {
    entities: () => Entity[];
}
export declare class SampleHandler implements UISampleHandler, SampleSelectHandler {
    private core;
    private state;
    constructor(core: SampleSystemCoreProvider);
    private isSampleEntity;
    private emit;
    onSampleSelected(sampleID: string): void;
    onSampleControlChange(sampleID: string, controlID: SampleUINodeID, value: number): void;
    onToggleSamplePlaying(sampleID: string): void;
    onSampleCreated(sampleID: string): void;
}
//# sourceMappingURL=sampleHandler.d.ts.map
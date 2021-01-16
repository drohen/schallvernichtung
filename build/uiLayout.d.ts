import type { SampleEntity, SampleState } from "./sampleEntity";
import type { SampleHandler } from "./sampleHandler";
import type { RecordingHandler } from "./recordingHandler";
import type { MathUtility } from "./mathUtility";
import type { Entity } from "./entity";
export interface UILayoutHandler {
    createID: () => string;
    addEntity: (entity: Entity) => void;
}
export declare class UILayout implements SampleEntity {
    id: string;
    private handler;
    private sampleHandler;
    private mathUtility;
    isSampleEntity: true;
    private baseEl;
    private sampleBlocks;
    private samplesMount;
    private sampleList;
    private recordBtn;
    constructor(id: string, handler: UILayoutHandler, sampleHandler: SampleHandler, mathUtility: MathUtility, mountSelector: string, recordingHandler: RecordingHandler, recordLength: number);
    private getElOrThrow;
    private wrap;
    private setUI;
    onSampleCreated(sampleID: string): void;
    onSampleStateChanged(sampleID: string, state: SampleState, previous: SampleState): void;
    onSampleSelectedChanged(sampleID: string): void;
    onSampleNodeValueChange(): void;
    onSampleError(error: Error): void;
}
//# sourceMappingURL=uiLayout.d.ts.map
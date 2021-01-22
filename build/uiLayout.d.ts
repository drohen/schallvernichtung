import type { Sample, SampleEntity } from "./sampleEntity";
import { UISampleCoreProvider } from "./uiSample";
import type { SampleHandler } from "./sampleHandler";
import type { RecordingHandler } from "./recordingHandler";
import type { Entity } from "./entity";
export interface UILayoutHandler extends UISampleCoreProvider {
    createID: () => string;
    addEntity: (entity: Entity) => void;
}
export declare class UILayout implements SampleEntity {
    id: string;
    private handler;
    private sampleHandler;
    isSampleEntity: true;
    private baseEl;
    private sampleBlocks;
    private samplesMount;
    private sampleList;
    private recordBtn;
    constructor(id: string, handler: UILayoutHandler, sampleHandler: SampleHandler, mountSelector: string, recordingHandler: RecordingHandler, recordLength: number, cssPath: string);
    private addStylesheet;
    private getElOrThrow;
    private wrap;
    private setUI;
    onSampleCreated(sample: Sample): void;
    onSampleSelectedChanged(): void;
    onSampleError(error: Error): void;
    onSampleNodeValueChange(): void;
    onSampleStateChanged(): void;
}
//# sourceMappingURL=uiLayout.d.ts.map
import type { SampleEntity, SampleState } from "./sampleEntity";
import { UISampleCoreProvider } from "./uiSample";
import type { SampleHandler } from "./sampleHandler";
import type { RecordingHandler } from "./recordingHandler";
import type { MathUtility } from "./mathUtility";
import type { Entity } from "./entity";
import { ImageHandler } from "./uiImages";
export interface UILayoutHandler extends UISampleCoreProvider {
    createID: () => string;
    addEntity: (entity: Entity) => void;
}
export declare class UILayout implements SampleEntity, ImageHandler {
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
    private images;
    private bg;
    private bgContext;
    constructor(id: string, handler: UILayoutHandler, sampleHandler: SampleHandler, mathUtility: MathUtility, mountSelector: string, recordingHandler: RecordingHandler, recordLength: number, cssPath: string);
    private addStylesheet;
    private getElOrThrow;
    private wrap;
    private setUI;
    private drawBg;
    onSampleCreated(sampleID: string): void;
    onSampleStateChanged(sampleID: string, state: SampleState, previous: SampleState): void;
    onSampleSelectedChanged(sampleID: string): void;
    onSampleNodeValueChange(): void;
    onSampleError(error: Error): void;
    onMushImageLoaded(): void;
    onHandImageLoaded(): void;
}
//# sourceMappingURL=uiLayout.d.ts.map
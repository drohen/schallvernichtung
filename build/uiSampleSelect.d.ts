import { RedomComponent } from "redom";
import { Sample, SampleEntity, SampleState } from "./sampleEntity";
export interface SampleSelectHandler {
    onSampleSelected: (sampleID: string) => void;
}
export declare class UISampleSelect implements RedomComponent, SampleEntity {
    id: string;
    private handler;
    el: HTMLElement;
    elements: {
        [id: string]: HTMLElement;
    };
    isSampleEntity: true;
    private selectedID?;
    constructor(id: string, handler: SampleSelectHandler);
    private handleClick;
    onSampleStateChanged(sampleID: string, state: SampleState): void;
    onSampleSelectedChanged(sampleID: string): void;
    onSampleError(error: Error): void;
    onSampleCreated(sample: Sample): void;
    onSampleNodeValueChange(): void;
}
//# sourceMappingURL=uiSampleSelect.d.ts.map
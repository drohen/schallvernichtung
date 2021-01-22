import { RedomComponent } from "redom";
import { UISamplePlayBtnHandler } from "./uiSamplePlayBtn";
import { UIRangeNodeHandler } from "./uiRangeNode";
import { Sample, SampleEntity, SampleState, SampleUINodeID } from "./sampleEntity";
import type { Entity } from "./entity";
export interface UISampleHandler extends UISamplePlayBtnHandler {
    onSampleControlChange: (sampleID: string, controlID: SampleUINodeID, value: number) => void;
}
export interface UISampleCoreProvider {
    addEntity: (entity: Entity) => void;
    createID: () => string;
}
export declare class UISample implements RedomComponent, UIRangeNodeHandler<SampleUINodeID>, SampleEntity {
    id: string;
    private handler;
    el: HTMLElement;
    isSampleEntity: true;
    private labelEl;
    private playBtn;
    private volumeCtrl;
    private lowpassCtrl;
    private distortionCtrl;
    private compressorCtrl;
    private speedCtrl;
    private state;
    private sampleID;
    constructor(id: string, handler: UISampleHandler, core: UISampleCoreProvider, sample: Sample);
    show(): void;
    hide(): void;
    onUIRangeChange(rangeID: SampleUINodeID, value: number): void;
    onSampleStateChanged(sampleID: string, state: SampleState): void;
    onSampleNodeValueChange(sampleID: string, nodeID: string, value: number): void;
    onSampleSelectedChanged(sampleID: string): void;
    onSampleError(error: Error): void;
    onSampleCreated(): void;
}
//# sourceMappingURL=uiSample.d.ts.map
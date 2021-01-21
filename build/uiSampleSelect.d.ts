import { RedomComponent } from "redom";
import { SampleEntity, SampleState } from "./sampleEntity";
export interface SampleSelectHandler {
    onSampleSelected: (sampleID: string) => void;
}
export interface SampleSelectImageProvider {
    mushImg: () => HTMLImageElement;
}
declare enum SelectState {
    playing = 0,
    selected = 1,
    playingAndHover = 2,
    playingAndSelected = 3,
    hover = 4,
    idle = 5
}
interface Sample {
    wrap: HTMLElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    state: SelectState;
    pattern: CanvasPattern;
    offset: number;
    previous: number;
}
export declare class UISampleSelect implements RedomComponent, SampleEntity {
    id: string;
    private handler;
    private img;
    el: HTMLElement;
    elements: {
        [id: string]: Sample;
    };
    isSampleEntity: true;
    private selectedID?;
    constructor(id: string, handler: SampleSelectHandler, img: SampleSelectImageProvider);
    private handleClick;
    private toggleHover;
    private renderCanvas;
    onSampleStateChanged(sampleID: string, state: SampleState): void;
    onSampleSelectedChanged(sampleID: string): void;
    onSampleNodeValueChange(): void;
    onSampleError(error: Error): void;
    onSampleCreated(sampleID: string): void;
}
export {};
//# sourceMappingURL=uiSampleSelect.d.ts.map
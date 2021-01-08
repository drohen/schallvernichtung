import { RedomComponent } from "redom";
export interface SampleSelectHandler {
    onSampleSelected: (index: number, previous?: number) => void;
}
export declare class SampleSelect implements RedomComponent {
    private handler;
    el: HTMLElement;
    elements: HTMLElement[];
    private selectedIndex;
    constructor(handler: SampleSelectHandler);
    private handleClick;
    add(index: number, label: string): void;
}
//# sourceMappingURL=sampleSelect.d.ts.map
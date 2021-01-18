import { RedomComponent } from "redom";
export interface UIRangeNodeHandler<T> {
    onUIRangeChange: (id: T, value: number) => void;
}
export declare class UIRange<T> implements RedomComponent {
    private id;
    private handler;
    el: HTMLElement;
    private labelEl;
    private canvas;
    private context2D;
    private value;
    private increment;
    private minIncrement;
    private maxIncrement;
    private minValue;
    private maxValue;
    private state;
    private startX;
    private img;
    private leftArrows;
    private rightArrows;
    private arrowWidth;
    private arrowHeight;
    private imageLoaded;
    constructor(id: T, handler: UIRangeNodeHandler<T>, label: string, init?: number);
    private handleUp;
    private setCanvasEvents;
    private onDown;
    private onUp;
    private onDrag;
    private flipflop;
    private updateValue;
    setValue(value: number): void;
    private renderCanvas;
}
//# sourceMappingURL=uiRangeNode.d.ts.map
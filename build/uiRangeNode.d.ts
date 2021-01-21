import { RedomComponent } from "redom";
import type { ResizeEntity } from "./resizeEntity";
export interface UIRangeNodeHandler<T> {
    onUIRangeChange: (id: T, value: number) => void;
}
export interface UIRangeImageProvider {
    handImg: () => HTMLImageElement;
}
export declare class UIRange<T> implements RedomComponent, ResizeEntity {
    id: string;
    private type;
    private handler;
    private imgProvider;
    el: HTMLElement;
    isResizeEntity: true;
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
    private leftArrows;
    private rightArrows;
    private arrowWidth;
    private arrowHeight;
    constructor(id: string, type: T, handler: UIRangeNodeHandler<T>, imgProvider: UIRangeImageProvider, label: string, init?: number);
    private setCanvasSize;
    private handleUp;
    private setCanvasEvents;
    private onDown;
    private onUp;
    private onDrag;
    private flipflop;
    private updateValue;
    private renderCanvas;
    update(): void;
    setValue(value: number): void;
    onResize(): void;
}
//# sourceMappingURL=uiRangeNode.d.ts.map
import { RedomComponent } from "redom";
export interface UIRangeNodeHandler<T> {
    onUIRangeChange: (id: T, value: number) => void;
}
export declare class UIRange<T> implements RedomComponent {
    private id;
    private handler;
    el: HTMLElement;
    private labelEl;
    private valueEl;
    private interactEl;
    private interactInner;
    private value;
    private increment;
    private minIncrement;
    private maxIncrement;
    private minValue;
    private maxValue;
    private state;
    private startX;
    constructor(id: T, handler: UIRangeNodeHandler<T>, label: string, init?: number);
    private handleUp;
    private setEvents;
    private onDown;
    private onUp;
    private onDrag;
    private updateValue;
    private buildInteract;
    setValue(value: number): void;
}
//# sourceMappingURL=uiRangeNode.d.ts.map
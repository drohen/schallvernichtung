import { RedomComponent } from "redom";
export interface UIRangeNodeHandler<T> {
    onUIRangeChange: (id: T, value: number) => void;
}
export declare class UIRange<T> implements RedomComponent {
    id: string;
    private type;
    private handler;
    el: HTMLElement;
    private labelEl;
    private numberEl;
    private decBtn;
    private incBtn;
    private value;
    private increment;
    private minValue;
    private maxValue;
    private state;
    private interval;
    constructor(id: string, type: T, handler: UIRangeNodeHandler<T>, label: string, init?: number);
    private handleUp;
    private setButtonEvents;
    private onDown;
    private onUp;
    setValue(value: number): void;
}
//# sourceMappingURL=uiRangeNode.d.ts.map
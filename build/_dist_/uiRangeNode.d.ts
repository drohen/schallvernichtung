import { RedomComponent } from "redom";
export interface UIRangeNodeHandler<T> {
    onUIRangeChange: (id: T, value: number) => void;
}
export declare class UIRange<T> implements RedomComponent {
    private id;
    private handler;
    el: HTMLInputElement;
    private debounce;
    private debounceCount;
    constructor(id: T, handler: UIRangeNodeHandler<T>, init?: `min` | `max` | `mid` | number);
    private debounceOnChange;
    setValue(value: number): void;
}
//# sourceMappingURL=uiRangeNode.d.ts.map
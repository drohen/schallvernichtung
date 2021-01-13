import { RedomComponent } from "redom";
import { AudioNodeExtension } from "./audioNodeExt";
export interface RangeCoreProvider {
    context: AudioContext;
}
export declare class RangeNodeUI extends AudioNodeExtension implements RedomComponent {
    protected core: RangeCoreProvider;
    el: HTMLInputElement;
    private debounce;
    private debounceCount;
    constructor(id: string, core: RangeCoreProvider, init?: `min` | `max` | `mid` | number);
    protected logRange(position: number, min: number, max: number, findPosition?: boolean): number;
    private debounceOnChange;
    protected onChange(value: number): void;
    protected ramp(param: AudioParam, to: number): void;
}
//# sourceMappingURL=rangeNodeUI.d.ts.map
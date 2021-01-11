import { UIRangeNode, RangeCoreProvider } from "./uiRangeNode";
export declare class SpeedControl extends UIRangeNode {
    private node;
    constructor(core: RangeCoreProvider, node: AudioBufferSourceNode);
    protected onChange(value: number): void;
}
//# sourceMappingURL=speedCtrl.d.ts.map
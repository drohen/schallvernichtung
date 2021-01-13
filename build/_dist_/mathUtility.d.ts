import type { SampleNodeMathProvider } from "./sampleNode";
import type { UISampleCoreProvider } from "./uiSample";
export declare class MathUtility implements UISampleCoreProvider, SampleNodeMathProvider {
    private logRange;
    getPositionForLogRangeValue(value: number, min: number, max: number): number;
    exponentialValueInRange(position: number, min: number, max: number): number;
}
//# sourceMappingURL=mathUtility.d.ts.map
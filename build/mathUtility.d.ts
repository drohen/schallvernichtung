import type { SampleNodeMathProvider } from "./sampleNode";
import type { UISampleMathProvider } from "./uiSample";
export declare class MathUtility implements UISampleMathProvider, SampleNodeMathProvider {
    private logRange;
    getPositionForLogRangeValue(value: number, min: number, max: number): number;
    exponentialValueInRange(position: number, min: number, max: number): number;
}
//# sourceMappingURL=mathUtility.d.ts.map
import type { CacheMathProvider } from "./cache";
import type { SampleNodeMathProvider } from "./sampleNode";
export declare class MathUtility implements CacheMathProvider, SampleNodeMathProvider {
    private logRange;
    getPositionForLogRangeValue(value: number, min: number, max: number): number;
    exponentialValueInRange(position: number, min: number, max: number): number;
}
//# sourceMappingURL=mathUtility.d.ts.map
import type { Entity } from "./entity";
export interface ResizeSystemCoreProvider {
    entities: () => Entity[];
}
export declare class ResizeHandler {
    private core;
    private debounceCount;
    private debounceTimeout;
    constructor(core: ResizeSystemCoreProvider);
    private isResizeEntity;
    private debounceEmit;
    private emit;
}
//# sourceMappingURL=resizeHandler.d.ts.map
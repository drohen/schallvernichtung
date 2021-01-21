import type { Entity } from "./entity";
export interface ResizeEntity extends Entity {
    isResizeEntity: true;
    onResize: (width: number, height: number) => void;
}
//# sourceMappingURL=resizeEntity.d.ts.map
import type { UIRangeImageProvider } from "./uiRangeNode";
export interface ImageHandler {
    onMushImageLoaded: () => void;
    onHandImageLoaded: () => void;
}
export declare class ImageProvider implements UIRangeImageProvider {
    private handler;
    private mush;
    private hand;
    private mushImgEl;
    private handImgEl;
    constructor(handler: ImageHandler);
    mushImgStr(): string;
    handImgStr(): string;
    mushImg(): HTMLImageElement;
    handImg(): HTMLImageElement;
}
//# sourceMappingURL=uiImages.d.ts.map
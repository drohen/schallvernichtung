import { RedomComponent } from "redom";
import { PlayHandler } from "./playBtn";
interface SampleCoreProvider {
    context: AudioContext;
    onPlaySample: (index: number) => void;
    onPauseSample: (index: number) => void;
}
export declare class SampleUI implements RedomComponent, PlayHandler {
    private core;
    private bufferNode;
    private nodeIndex;
    el: HTMLElement;
    private playBtn;
    private distortionCtrl;
    private compressorCtrl;
    private volumeCtrl;
    private lowpassCtrl;
    private speedCtrl;
    private state;
    constructor(core: SampleCoreProvider, bufferNode: AudioBufferSourceNode, nodeIndex: number);
    private wrap;
    show(): void;
    hide(): void;
    onPlay(): Promise<void>;
    onPause(): Promise<void>;
}
export {};
//# sourceMappingURL=sampleUI.d.ts.map
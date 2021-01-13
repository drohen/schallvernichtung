import type { RedomComponent } from "redom";
import { SampleState } from "./sampleEntity";
import { ButtonInteractionHandler, UIButton } from "./uiButton";
export interface UISamplePlayBtnHandler {
    onToggleSamplePlaying: (sampleID: string) => void;
}
export declare class UISamplePlayBtn implements RedomComponent, ButtonInteractionHandler {
    private sampleID;
    private handler;
    el: UIButton;
    constructor(sampleID: string, handler: UISamplePlayBtnHandler);
    onClick(): void;
    onStateChange(state: SampleState): void;
}
//# sourceMappingURL=uiSamplePlayBtn.d.ts.map
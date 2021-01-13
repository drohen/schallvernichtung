import type { RedomComponent } from "redom";
import { RecordingEntity, RecordingState } from "./recordingEntity";
import { ButtonInteractionHandler, UIButton } from "./uiButton";
export interface UIRecordButtonHandler {
    recordButtonOnStart: () => void;
    recordButtonOnStop: () => void;
    recordButtonOnReload: () => void;
    recordButtonOnRequest: () => void;
}
export declare class UIRecordBtn implements RedomComponent, RecordingEntity, ButtonInteractionHandler {
    id: string;
    private handler;
    private recordLength;
    el: UIButton;
    isRecordingEntity: true;
    private recordingTimeout;
    constructor(id: string, handler: UIRecordButtonHandler, recordLength: number);
    private stopRecording;
    onDown(state: string): void;
    onUp(state: string): void;
    onLeave(state: string): void;
    onClick(state: string): void;
    onRecordingStateChanged(state: RecordingState): void;
    onRecordingError(): void;
}
//# sourceMappingURL=uiRecordBtn.d.ts.map
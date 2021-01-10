import type { Entity } from "./entity";
import type { RedomComponent } from "redom";
import { RecordingEntity, RecordingState } from "./recordingEntity";
import { ButtonInteractionHandler, UIButton } from "./uiButton";
export interface RecordButtonHandler {
    recordButtonOnStart: () => void;
    recordButtonOnStop: () => void;
    recordButtonOnReload: () => void;
}
export declare class RecordBtn implements RedomComponent, RecordingEntity, ButtonInteractionHandler, Entity {
    id: string;
    private handler;
    private recordLength;
    el: UIButton;
    isRecordingEntity: true;
    private recordingTimeout;
    constructor(id: string, handler: RecordButtonHandler, recordLength: number);
    private stopRecording;
    onDown(state: string): void;
    onUp(state: string): void;
    onLeave(state: string): void;
    onRecordingStateChanged(state: RecordingState): void;
    onRecordingError(): void;
}
//# sourceMappingURL=recordBtn.d.ts.map
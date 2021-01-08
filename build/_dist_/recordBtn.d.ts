import { RedomComponent } from "redom";
export interface RecordHandler {
    /**
     * Handle stream then return promise so the button
     * can update its state to handle recording button
     * click to start recording
     */
    handleStream: (stream: MediaStream) => Promise<void>;
    onError: () => void;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    reloadContext: () => Promise<void>;
}
export declare class RecordBtn implements RedomComponent {
    private handler;
    private recordLength;
    el: HTMLButtonElement;
    private state;
    private error?;
    private mediaTracks;
    private recordingTimeout;
    constructor(handler: RecordHandler, recordLength: number);
    private reset;
    private setError;
    private setRecordingReady;
    private requestDevice;
    private disable;
    private enable;
    private stopRecording;
    private recordBtnDown;
    private recordBtnUp;
    private recordBtnEvent;
    getError(): Error | undefined;
}
//# sourceMappingURL=recordBtn.d.ts.map
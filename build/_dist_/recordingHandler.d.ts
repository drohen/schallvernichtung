import type { Entity } from "./entity";
import type { UIRecordButtonHandler } from "./uiRecordBtn";
import type { AudioNodeManagerContext } from "./audioNodeExt";
/**
 * Recording system will manage the APIs responsible
 * for handling the audio captured from a user.
 *
 * It answers the questions:
 * - Do we have access to some input device?
 * - Are we recording?
 * - Where do we store the recording data?
 * - How do we handle the recorded data?
 */
export interface RecordingSystemCoreProvider {
    entities: () => Entity[];
    onRecorded: (buffer: Float32Array) => void;
}
export interface AudioContextProvider {
    context: () => AudioContext;
    getRecorderNode: () => AudioNodeManagerContext;
    /**
     * Handle stream then return promise so the button
     * can update its state to handle recording button
     * click to start recording
     */
    handleStream: (stream: MediaStream) => Promise<void>;
}
export declare class RecordingHandler implements UIRecordButtonHandler {
    private core;
    private audio;
    private workerPath;
    private chunkSize;
    private recordLength;
    private recorderNode?;
    private mediaTracks;
    private recorder?;
    private state;
    constructor(core: RecordingSystemCoreProvider, audio: AudioContextProvider, workerPath: string, chunkSize: number, recordLength: number);
    private setRecorder;
    private unsetRecorder;
    private handleRecorderMessage;
    private processChunk;
    private isRecordingEntity;
    private postRecorder;
    private shiftState;
    private emit;
    private getCapture;
    recordButtonOnStart(): void;
    recordButtonOnStop(): void;
    recordButtonOnReload(): void;
    recordButtonOnRequest(): void;
}
//# sourceMappingURL=recordingHandler.d.ts.map
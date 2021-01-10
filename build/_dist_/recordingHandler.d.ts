import type { Entity } from "./entity";
import type { RecordButtonHandler } from "./recordBtn";
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
    context: AudioContext;
    entities: Entity[];
    /**
     * Handle stream then return promise so the button
     * can update its state to handle recording button
     * click to start recording
     */
    handleStream: (stream: MediaStream) => Promise<void>;
}
export declare class RecordingHandler implements RecordButtonHandler {
    private core;
    private workerPath;
    private chunkSize;
    private recorderNode?;
    private mediaTracks;
    private recorder?;
    private state;
    constructor(core: RecordingSystemCoreProvider, workerPath: string, chunkSize: number, recordLength: number);
    private addRecorder;
    private handleRecorderMessage;
    private addWorkletScript;
    private processChunk;
    private isRecordingEntity;
    private postRecorder;
    private shiftState;
    private emit;
    private getCapture;
    recordButtonOnStart(): void;
    recordButtonOnStop(): void;
    recordButtonOnReload(): void;
}
//# sourceMappingURL=recordingHandler.d.ts.map
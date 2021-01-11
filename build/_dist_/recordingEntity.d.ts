import type { Entity } from "./entity";
export declare enum RecordingState {
    noDevice = 0,
    requestingDevice = 1,
    idle = 2,
    starting = 3,
    ready = 4,
    recording = 5,
    closing = 6,
    error = 7
}
export interface RecordingEntity extends Entity {
    isRecordingEntity: true;
    onRecordingStateChanged: (state: RecordingState) => void;
    onRecordingError: (error: Error) => void;
}
export interface RecordingWorkerCloseMessage {
    command: `close`;
}
export interface RecordingWorkerInitMessage {
    command: `init`;
    data: {
        sampleRate: number;
        maxLength: number;
        chunkSize: number;
    };
}
export interface RecordingWorkerStartMessage {
    command: `start`;
}
export interface RecordingWorkerStopMessage {
    command: `stop`;
}
export interface RecordingWorkerChunkMessage {
    command: `chunk`;
    buffer: Float32Array;
}
export interface RecordingWorkerOutputReadyMessage {
    message: `ready`;
}
export interface RecordingWorkerOutputBufferMessage {
    message: `done`;
    buffer: Float32Array;
}
export interface RecordingWorkerOutputRecordingMessage {
    message: `recording`;
}
//# sourceMappingURL=recordingEntity.d.ts.map
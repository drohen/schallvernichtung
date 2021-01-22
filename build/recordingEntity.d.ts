import type { Entity } from "./entity";
export declare enum RecordingState {
    noDevice = 0,
    requestingDevice = 1,
    streamInitiated = 2,
    idle = 3,
    starting = 4,
    ready = 5,
    recording = 6,
    closing = 7,
    error = 8
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
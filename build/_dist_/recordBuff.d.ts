export interface RecordedBufferHandler {
    onRecorded: (data: Float32Array) => void;
}
export declare class RecordBuffer {
    private sampleRate;
    private maxLength;
    private chunkSize;
    private handler;
    private state;
    private recordingLength;
    private bufferSize;
    private buffer;
    private prepCounter;
    constructor(sampleRate: number, maxLength: number, chunkSize: number, handler: RecordedBufferHandler);
    record(): void;
    onChunk(chunk: Float32Array): void;
    stopRecord(): void;
    isRecording(): boolean;
}
//# sourceMappingURL=recordBuff.d.ts.map
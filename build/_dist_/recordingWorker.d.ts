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
    private emptyBuffer;
    constructor(sampleRate: number, maxLength: number, chunkSize: number, handler: RecordedBufferHandler);
    private joinEnds;
    record(): void;
    onChunk(chunk: Float32Array): void;
    stopRecord(): void;
    isRecording(): boolean;
}
export declare class RecordingWorklet extends AudioWorkletProcessor implements RecordedBufferHandler {
    private buffer?;
    private state;
    constructor();
    private handleData;
    private close;
    onRecorded(data: Float32Array): void;
    /**
     *
     * @param inputs inputs[n][m][i] will access n-th input, m-th channel of that input, and i-th sample of that channel.
     */
    process(inputs: Float32Array[][]): boolean;
}
//# sourceMappingURL=recordingWorker.d.ts.map
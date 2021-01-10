import { RecordedBufferHandler } from "./recordBuff";
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
//# sourceMappingURL=recordingWorklet.d.ts.map
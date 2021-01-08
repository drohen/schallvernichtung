import { RecordHandler } from "./recordBtn";
import { RecordedBufferHandler } from "./recordBuff";
import { SampleCoreProvider } from "./sampleBank";
import { SampleSelectHandler } from "./sampleSelect";
export declare class Schallvernichtung implements RecordHandler, RecordedBufferHandler, SampleCoreProvider, SampleSelectHandler {
    private baseEl;
    context: AudioContext;
    private recordBtn;
    private sourceNode?;
    private processorNode;
    private recordBuff;
    private sampleBlocks;
    private sampleBank;
    private samplesMount;
    private sampleList;
    static init(): void;
    constructor();
    private getElOrThrow;
    private wrap;
    private setUI;
    private processChunk;
    onRecorded(data: Float32Array): void;
    handleStream(stream: MediaStream): Promise<void>;
    onError(): void;
    startRecording(): Promise<void>;
    stopRecording(): Promise<void>;
    reloadContext(): Promise<void>;
    onPlaySample(index: number): Promise<void>;
    onPauseSample(index: number): Promise<void>;
    onSampleAdd(index: number): void;
    onLabelChange(): void;
    onSampleSelected(index: number, previous?: number): void;
}
//# sourceMappingURL=schallvernichtung.d.ts.map
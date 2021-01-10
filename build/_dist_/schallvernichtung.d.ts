import type { Entity } from "./entity";
import { RecordingSystemCoreProvider } from "./recordingHandler";
import { SampleCoreProvider } from "./sampleBank";
import { SampleSelectHandler } from "./sampleSelect";
export declare class Schallvernichtung implements SampleCoreProvider, SampleSelectHandler, RecordingSystemCoreProvider {
    private baseEl;
    context: AudioContext;
    private recordBtn;
    private sourceNode?;
    private recordingHandler;
    private sampleBlocks;
    private sampleBank;
    private samplesMount;
    private sampleList;
    entities: Entity[];
    static init(): void;
    constructor();
    private getElOrThrow;
    private wrap;
    private setUI;
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
export interface SampleCoreProvider {
    context: AudioContext;
    onSampleAdd: (index: number) => void;
    onLabelChange: (index: number) => void;
}
declare enum SampleState {
    notStarted = 0,
    paused = 1,
    playing = 2
}
export interface Sample {
    node: AudioBufferSourceNode;
    label: string;
    state: SampleState;
}
export declare class SampleBank {
    private core;
    private channels;
    private samples;
    constructor(core: SampleCoreProvider, channels: number);
    create(data: Float32Array): void;
    play(index: number): void;
    pause(index: number): void;
    setLabel(index: number, label: string): void;
    setPlaybackSpeed(index: number, value: number): void;
    node(index: number): AudioBufferSourceNode;
    label(index: number): string;
}
export {};
//# sourceMappingURL=sampleBank.d.ts.map
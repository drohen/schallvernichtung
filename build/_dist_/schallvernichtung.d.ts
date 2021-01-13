import type { Entity } from "./entity";
import { RecordingSystemCoreProvider } from "./recordingHandler";
import { SampleSystemCoreProvider } from "./sampleHandler";
export declare class Schallvernichtung implements RecordingSystemCoreProvider, SampleSystemCoreProvider {
    private baseEl;
    private contextNodeID;
    private contextNode;
    private recordBtn;
    private recordingHandler;
    private sampleHandler;
    private sampleBlocks;
    private samplesMount;
    private sampleList;
    private _entities;
    private mathUtility;
    constructor(mountSelector: string, workerPath: string);
    private addEntity;
    private createID;
    private getElOrThrow;
    private wrap;
    private setUI;
    entities(): Entity[];
    onRecorded(data: Float32Array): void;
}
//# sourceMappingURL=schallvernichtung.d.ts.map
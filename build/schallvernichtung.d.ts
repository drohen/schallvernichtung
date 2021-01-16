import type { Entity } from "./entity";
import { RecordingSystemCoreProvider } from "./recordingHandler";
import { SampleSystemCoreProvider } from "./sampleHandler";
import { UILayoutHandler } from "./uiLayout";
export declare class Schallvernichtung implements RecordingSystemCoreProvider, SampleSystemCoreProvider, UILayoutHandler {
    private contextNodeID;
    private contextNode;
    private recordingHandler;
    private sampleHandler;
    private _entities;
    private mathUtility;
    private ui;
    constructor(mountSelector: string, workerPath: string, cssPath: string);
    addEntity(entity: Entity): void;
    createID(): string;
    entities(): Entity[];
    onRecorded(data: Float32Array): void;
}
//# sourceMappingURL=schallvernichtung.d.ts.map
import type { Entity } from "./entity";
import { RecordingSystemCoreProvider } from "./recordingHandler";
import { SampleSystemCoreProvider } from "./sampleHandler";
import { UILayoutHandler } from "./uiLayout";
import { CacheHandler } from "./cache";
import type { Sample } from "./sampleEntity";
export declare class Schallvernichtung implements SampleSystemCoreProvider, UILayoutHandler, RecordingSystemCoreProvider, CacheHandler {
    onCacheLoaded: () => void;
    private contextNodeID;
    private contextNode;
    private recordingHandler;
    private sampleHandler;
    private _entities;
    private mathUtility;
    private ui;
    private cache;
    constructor(mountSelector: string, webWorkerPath: string, cssPath: string, serviceWorkerPath?: string);
    private createServiceWorkerPath;
    private registerServiceWorker;
    emitSample(sample: Sample): void;
    addEntity(entity: Entity): void;
    createID(): string;
    entities(): Entity[];
}
//# sourceMappingURL=schallvernichtung.d.ts.map
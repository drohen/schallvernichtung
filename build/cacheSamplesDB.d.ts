import Dexie from 'dexie';
import type { Sample } from './sampleEntity';
export declare class CacheSamplesDB extends Dexie {
    samples: Dexie.Table<Sample, string>;
    constructor();
}
//# sourceMappingURL=cacheSamplesDB.d.ts.map
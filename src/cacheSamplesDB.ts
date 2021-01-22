import Dexie from 'dexie'
import type { Sample } from './sampleEntity'

export class CacheSamplesDB extends Dexie 
{
	public samples: Dexie.Table<Sample, string>
	
	public constructor() 
	{
		super( `SamplesDatabase` )

		this.version( 1 ).stores( {
			samples: `id, data, label, volume, speed, compressor, filter, distortion`
		} )

		this.samples = this.table( `samples` )
	}
}
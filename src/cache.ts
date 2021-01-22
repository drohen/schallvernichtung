import { CacheSamplesDB } from "./cacheSamplesDB"
import { RecordingEntity, RecordingState } from "./recordingEntity"
import type { RecordingSystemHandler } from "./recordingHandler"
import type { Sample, SampleEntity, SampleUINodeID } from "./sampleEntity"

export interface CacheHandler
{
	createID: () => string

	emitSample: ( sample: Sample ) => void

	onCacheLoaded: () => void
}

export interface CacheMathProvider
{
	getPositionForLogRangeValue: ( value: number, min: number, max: number ) => number
}

export class Cache implements SampleEntity, RecordingSystemHandler, RecordingEntity
{
	public isSampleEntity: true

	public isRecordingEntity: true

	private db: CacheSamplesDB

	private baseSpeed: number

	constructor(
		public id: string,
		private handler: CacheHandler,
		math: CacheMathProvider
	)
	{
		this.isSampleEntity = true

		this.isRecordingEntity = true
 
		this.db = new CacheSamplesDB()

		this.baseSpeed = math.getPositionForLogRangeValue( 1, 0.1, 3 )
	}
	
	private loadCache(): void
	{
		this.db.samples.each( sample => 
		{
			this.handler.emitSample( sample )
		} )
			.then( () => this.handler.onCacheLoaded() )
			.catch( () =>
			{
				// TODO: handle error
			} )
	}

	public onSampleNodeValueChange( sampleID: string, nodeID: SampleUINodeID, value: number ): void
	{
		this.db.samples.update( sampleID, { [ nodeID ]: value } )
			.catch( () =>
			{
				// TODO: handle error
			} )
	}

	public onRecorded( data: Float32Array ): void
	{
		const sample: Sample = {
			id: this.handler.createID(),
			data,
			label: `Sample ${( new Date() ).toUTCString()}`,
			compressor: 1,
			distortion: 1,
			lowpass: 1,
			speed: this.baseSpeed,
			volume: 500001
		}

		this.db.samples
			.add( sample )
			.then( () =>
			{
				this.handler.emitSample( sample )
			} )
			.catch( () =>
			{
				// TODO: emit error
			} )
	}

	public onRecordingStateChanged( state: RecordingState ): void
	{
		if ( state === RecordingState.streamInitiated )
		{
			this.loadCache()
		}
	}

	public onSampleError(): void
	{
		// Not used
	}

	public onSampleSelectedChanged(): void
	{
		// Not used
	}

	public onSampleCreated(): void
	{
		// Not used
	}

	public onSampleStateChanged(): void
	{
		// Not used
	}

	public onRecordingError( error: Error ): void
	{
		// TODO: Handle error?
	}
}
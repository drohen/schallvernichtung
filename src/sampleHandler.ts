import type { SampleSelectHandler } from "./uiSampleSelect"
import type { UISampleHandler } from "./uiSample"
import type { Entity } from "./entity"
import { SampleEntity, SampleState, SampleUINodeID } from "./sampleEntity"

export interface SampleSystemCoreProvider
{
	entities: () => Entity[]
}

export class SampleHandler implements UISampleHandler, SampleSelectHandler
{
	private state: {[id: string]: SampleState}

	constructor(
		private core: SampleSystemCoreProvider
	)
	{
		this.state = {}
	}

	private isSampleEntity( entity: Entity | SampleEntity ): entity is SampleEntity
	{
		return `isSampleEntity` in entity && entity.isSampleEntity
	}

	private emit( apply: ( entity: SampleEntity ) => void )
	{
		for ( let i = 0; i < this.core.entities().length; i++ )
		{
			const entity = this.core.entities()[ i ]

			if ( this.isSampleEntity( entity ) )
			{
				apply( entity )
			}
		}
	}

	public onSampleSelected( sampleID: string ): void
	{
		this.emit( entity => entity.onSampleSelectedChanged( sampleID ) )
	}
	
	public onSampleControlChange( sampleID: string, controlID: SampleUINodeID, value: number ): void
	{
		this.emit( entity => entity.onSampleNodeValueChange( sampleID, controlID, value ) )
	}

	public onToggleSamplePlaying( sampleID: string ): void
	{
		const previous = this.state[ sampleID ]

		this.state[ sampleID ] = this.state[ sampleID ] === SampleState.notStarted || this.state[ sampleID ] === SampleState.paused
			? SampleState.playing
			: SampleState.paused

		this.emit( entity => entity.onSampleStateChanged( sampleID, this.state[ sampleID ], previous ) )
	}

	public onSampleCreated( sampleID: string ): void
	{
		this.state[ sampleID ] = SampleState.notStarted

		this.emit( entity => entity.onSampleCreated( sampleID ) )
	}
}
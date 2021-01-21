import type { Entity } from "./entity"
import type { ResizeEntity } from "./resizeEntity"

export interface ResizeSystemCoreProvider
{
	entities: () => Entity[]
}

export class ResizeHandler
{
	private debounceCount: number

	private debounceTimeout: number

	constructor(
		private core: ResizeSystemCoreProvider
	)
	{
		this.debounceCount = 0

		this.debounceTimeout = 0

		this.emit = this.emit.bind( this )

		this.debounceEmit = this.debounceEmit.bind( this )

		window.addEventListener( `resize`, this.debounceEmit )
	}

	private isResizeEntity( entity: Entity | ResizeEntity ): entity is ResizeEntity
	{
		return `isResizeEntity` in entity && entity.isResizeEntity
	}

	private debounceEmit()
	{
		clearTimeout( this.debounceTimeout )

		if ( this.debounceCount >= 10 )
		{
			this.debounceCount = 0

			this.emit()
		}

		this.debounceCount += 1

		this.debounceTimeout = window.setTimeout( this.emit, 100 )
	}

	private emit()
	{
		for ( let i = 0; i < this.core.entities().length; i++ )
		{
			const entity = this.core.entities()[ i ]

			if ( this.isResizeEntity( entity ) )
			{
				entity.onResize( window.innerWidth, window.innerHeight )
			}
		}
	}
}
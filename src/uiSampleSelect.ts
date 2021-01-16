import { el, mount, RedomComponent } from "redom"
import { SampleEntity, SampleState } from "./sampleEntity"

export interface SampleSelectHandler
{
	onSampleSelected: ( sampleID: string ) => void
}

export class UISampleSelect implements RedomComponent, SampleEntity
{
	public el: HTMLElement

	public elements: {[id: string]: HTMLElement}
	
	public isSampleEntity: true

	private selectedID?: string

	constructor(
		public id: string,
		private handler: SampleSelectHandler
	)
	{
		this.el = el( `div.sampleSelect` )

		this.isSampleEntity = true

		this.handleClick = this.handleClick.bind( this )

		this.elements = {}

		this.selectedID = undefined
	}

	private handleClick( sampleID: string )
	{
		if ( sampleID === this.selectedID ) return

		this.handler.onSampleSelected( sampleID )
	}

	public onSampleStateChanged( sampleID: string, state: SampleState ): void
	{
		switch( state )
		{
			case SampleState.paused:

				this.elements[ sampleID ].classList.remove( `playing` )

				break

			case SampleState.playing:

				this.elements[ sampleID ].classList.add( `playing` )

				break
		}
	}

	public onSampleSelectedChanged( sampleID: string ): void
	{
		if ( this.selectedID ) this.elements[ this.selectedID ].classList.remove( `selected` )

		this.elements[ sampleID ].classList.add( `selected` )

		this.selectedID = sampleID

		window.scrollTo( 0, 0 )
	}

	public onSampleNodeValueChange(): void
	{
		// do nothing
	}

	public onSampleError( error: Error ): void
	{
		// TODO: show err?
	}

	public onSampleCreated( sampleID: string ): void
	{
		if ( this.elements[ sampleID ] )
		{
			throw Error( `Select list already contains sample ${sampleID}` )
		}

		const label = el( `span`, `Sample ${( new Date() ).toUTCString()}` )

		const labelWrap = el( `p` )

		mount( labelWrap, label )

		const item = el( `div.sampleItem` )

		mount( item, labelWrap )

		item.addEventListener( `click`, ( event: MouseEvent ) => 
		{
			event.preventDefault()

			this.handleClick( sampleID )
		} )

		this.elements[ sampleID ] = item

		mount( this.el, item )
	}
}
import { el, mount, RedomComponent } from "redom"

export interface SampleSelectHandler
{
	onSampleSelected: ( index: number, previous?: number ) => void
}

export class SampleSelect implements RedomComponent
{
	public el: HTMLElement

	public elements: HTMLElement[]

	private selectedIndex: number

	constructor(
		private handler: SampleSelectHandler
	)
	{
		this.el = el( `div.sampleSelect` )

		this.handleClick = this.handleClick.bind( this )

		this.elements = []

		this.selectedIndex = -1
	}

	private handleClick( index: number )
	{
		if ( index === this.selectedIndex ) return

		if ( this.selectedIndex > -1 )
			this.elements[ this.selectedIndex ].classList.remove( `selected` )

		this.elements[ index ].classList.add( `selected` )

		this.handler.onSampleSelected( index, this.selectedIndex > -1 ? this.selectedIndex : undefined )

		this.selectedIndex = index
	}

	public add( index: number, label: string ): void
	{
		const item = el( `div.sampleItem`, label )

		item.addEventListener( `click`, ( event: MouseEvent ) => 
		{
			event.preventDefault()

			this.handleClick( index )
		} )

		this.elements.push( item )

		mount( this.el, item )
	}
}
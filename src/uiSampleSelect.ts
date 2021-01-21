import { el, mount, RedomComponent } from "redom"
import { SampleEntity, SampleState } from "./sampleEntity"

export interface SampleSelectHandler
{
	onSampleSelected: ( sampleID: string ) => void
}

export interface SampleSelectImageProvider
{
	mushImg: () => HTMLImageElement
}

enum SelectState
{
	playing,
	selected,
	playingAndHover,
	playingAndSelected,
	hover,
	idle
}

interface Sample
{
	wrap: HTMLElement
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	state: SelectState
	pattern: CanvasPattern
	offset: number
	previous: number
}

export class UISampleSelect implements RedomComponent, SampleEntity
{
	public el: HTMLElement

	public elements: {[id: string]: Sample }
	
	public isSampleEntity: true

	private selectedID?: string

	constructor(
		public id: string,
		private handler: SampleSelectHandler,
		private img: SampleSelectImageProvider
	)
	{
		this.el = el( `div.sampleSelect` )

		this.isSampleEntity = true

		this.handleClick = this.handleClick.bind( this )

		this.renderCanvas = this.renderCanvas.bind( this )

		this.toggleHover = this.toggleHover.bind( this )

		this.elements = {}

		this.selectedID = undefined
	}

	private handleClick( sampleID: string )
	{
		if ( sampleID === this.selectedID ) return

		this.handler.onSampleSelected( sampleID )
	}

	private toggleHover( sampleID: string )
	{
		switch( this.elements[ sampleID ].state )
		{
			case SelectState.hover:

				this.elements[ sampleID ].state = SelectState.idle

				this.renderCanvas( sampleID )

				return

			case SelectState.playingAndHover:

				this.elements[ sampleID ].state = SelectState.playing

				return

			case SelectState.idle:

				this.elements[ sampleID ].state = SelectState.hover

				this.renderCanvas( sampleID )

				return

			case SelectState.playing:

				this.elements[ sampleID ].state = SelectState.playingAndHover

				return

			default:
				return
		}
	}

	private renderCanvas( sampleID: string, time?: number )
	{
		const { canvas, context, state, pattern, offset, previous } = this.elements[ sampleID ]

		switch( state )
		{
			case SelectState.idle:
				// TODO: set to transparent
				context.filter = ``

				canvas.style.opacity = `0`

				return // idle is not animated

			case SelectState.selected:
				// TODO: set to base image view
				context.filter = `hue-rotate(250deg) saturate(110%) opacity(38%)`
				
				canvas.style.opacity = `1`

				// animate image
				context.clearRect( 0, 0, canvas.width, canvas.height )

				context.fillStyle = pattern
		
				context.fillRect(
					0,
					0,
					canvas.width,
					1200
				)

				return // selected is not animated

			case SelectState.hover:
				// TODO: image is drawn, animated
				context.filter = ``
			
				break

			case SelectState.playing:

				// TODO: image is drawn, animated
				context.filter = `hue-rotate(150deg) saturate(120%) opacity(40%)`
				
				break

			case SelectState.playingAndHover:

				// TODO: image is drawn, animated
				context.filter = `hue-rotate(80deg) saturate(120%) opacity(40%)`

				break

			case SelectState.playingAndSelected:

				// TODO: image is drawn, animated
				context.filter = `hue-rotate(250deg) saturate(150%) opacity(40%)`

				break
		}

		canvas.style.opacity = `1`

		context.clearRect( 0, 0, canvas.width, canvas.height )

		context.save()

		context.fillStyle = pattern

		if ( offset > 0 )
		{
			context.save()

			context.translate( 0, offset - 1200 )
			
			context.fillRect( 0, 0, canvas.width, 1200 )

			context.restore()
		}

		context.translate( 0, offset )

		context.fillRect( 0, 0, canvas.width, 1200 )

		context.translate( 0, offset )

		context.restore()

		const t = time ?? performance.now()

		this.elements[ sampleID ].offset = offset >= 1200
			? 0
			: previous === 0
				? offset + 1
				: offset + ( ( t - previous ) * 0.08 )

		this.elements[ sampleID ].previous = t

		requestAnimationFrame( time => this.renderCanvas( sampleID, time ) )
	}

	public onSampleStateChanged( sampleID: string, state: SampleState ): void
	{
		switch( state )
		{
			case SampleState.paused:

				this.elements[ sampleID ].wrap.classList.remove( `playing` )

				this.elements[ sampleID ].state = this.elements[ sampleID ].state === SelectState.playingAndSelected
					? SelectState.selected
					: SelectState.idle

				break

			case SampleState.playing:

				this.elements[ sampleID ].wrap.classList.add( `playing` )

				this.elements[ sampleID ].state = this.elements[ sampleID ].state === SelectState.selected
					? SelectState.playingAndSelected
					: SelectState.playing

				break
		}

		this.renderCanvas( sampleID )
	}

	public onSampleSelectedChanged( sampleID: string ): void
	{
		if ( this.selectedID )
		{
			this.elements[ this.selectedID ].wrap.classList.remove( `selected` )

			// check if select item isn't currently in render loop
			const rerender = this.elements[ this.selectedID ].state === SelectState.selected

			this.elements[ this.selectedID ].state = rerender ? SelectState.idle : SelectState.playing

			if ( rerender ) this.renderCanvas( this.selectedID )
		}

		this.elements[ sampleID ].wrap.classList.add( `selected` )

		this.selectedID = sampleID

		this.elements[ sampleID ].state = this.elements[ sampleID ].state === SelectState.playing 
			? SelectState.playingAndSelected 
			: SelectState.selected

		this.renderCanvas( sampleID )
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

		const wrap = el( `div.sampleItem` )

		const label = el( `span`, `Sample ${( new Date() ).toUTCString()}` )

		const labelWrap = el( `p` )

		mount( labelWrap, label )

		mount( wrap, labelWrap )

		const canvas = el( `canvas` ) as HTMLCanvasElement

		// TODO: on mouseover set state hover

		const context = canvas.getContext( `2d` )

		if ( !context )
		{
			throw Error( `No canvas context for selector for ${sampleID}` )
		}

		wrap.addEventListener( `click`, ( event: MouseEvent ) => 
		{
			event.preventDefault()

			this.handleClick( sampleID )
		} )

		wrap.addEventListener( `mouseenter`, () => this.toggleHover( sampleID ) )

		wrap.addEventListener( `mouseleave`, () => this.toggleHover( sampleID ) )

		context.save()

		canvas.width = 400

		canvas.height = 1200

		context.drawImage(
			this.img.mushImg(),
			0,
			0,
			canvas.width,
			canvas.height
		)

		const pattern = context.createPattern( canvas, `repeat` )

		if ( !pattern )
		{
			throw Error( `No pattern for selector for ${sampleID}` )
		}

		context.restore()

		this.elements[ sampleID ] = { wrap, canvas, context, pattern, state: SelectState.idle, offset: 0, previous: 0 }

		mount( this.el, wrap )

		canvas.width = wrap.clientWidth

		mount( wrap, canvas )
	}
}
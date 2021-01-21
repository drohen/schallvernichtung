import { el, mount, RedomComponent } from "redom"
import type { ResizeEntity } from "./resizeEntity"

export interface UIRangeNodeHandler<T>
{
	onUIRangeChange: ( id: T, value: number ) => void
}

export interface UIRangeImageProvider
{
	handImg: () => HTMLImageElement
}

enum RangeState
{
	locked,
	idle,
	down,
	slide,
	released
}

export class UIRange<T> implements RedomComponent, ResizeEntity
{
	public el: HTMLElement

	public isResizeEntity: true

	private labelEl: HTMLSpanElement

	private canvas: HTMLCanvasElement

	private context2D: CanvasRenderingContext2D

	private value: number

	private increment: number

	private minIncrement: number

	private maxIncrement: number

	private minValue: number

	private maxValue: number

	private state: RangeState

	private startX: number

	private leftArrows: string

	private rightArrows: string

	private arrowWidth: number

	private arrowHeight: number

	constructor(
		public id: string,
		private type: T,
		private handler: UIRangeNodeHandler<T>,
		private imgProvider: UIRangeImageProvider,
		label: string,
		init = 1
	)
	{
		this.value = init

		this.el = el( `div.rangeChange` )

		this.isResizeEntity = true

		const labelP = el( `p` )

		this.labelEl = el( `span`, label )

		mount( labelP, this.labelEl )

		mount( this.el, labelP )

		this.canvas = el( `canvas` ) as HTMLCanvasElement

		const context = this.canvas.getContext( `2d` )

		if ( !context )
		{
			throw Error( `No canvas context for ui range node ${this.type}` )
		}

		this.context2D = context
		
		mount( this.el, this.canvas )

		this.context2D.font = `57px "Courier New", Courier, monospace`

		this.leftArrows = `‹‹‹‹‹‹‹‹‹`

		this.rightArrows = `›››››››››`

		const measure = this.context2D.measureText( this.leftArrows )

		this.arrowWidth = measure.width

		this.arrowHeight = measure.actualBoundingBoxAscent

		this.increment = 0

		this.minIncrement = 1

		this.maxIncrement = 10000

		this.maxValue = 1000001

		this.minValue = 1

		this.startX = 0

		this.state = RangeState.idle

		this.onDown = this.onDown.bind( this )

		this.onUp = this.onUp.bind( this )

		this.onDrag = this.onDrag.bind( this )

		this.updateValue = this.updateValue.bind( this )

		this.handleUp = this.handleUp.bind( this )

		this.setValue = this.setValue.bind( this )

		this.flipflop = this.flipflop.bind( this )

		this.renderCanvas = this.renderCanvas.bind( this )

		this.setCanvasSize = this.setCanvasSize.bind( this )

		this.onResize = this.onResize.bind( this )

		this.setCanvasEvents()

		this.renderCanvas()
	}

	private setCanvasSize()
	{
		this.canvas.width = this.el.clientWidth

		this.canvas.height = 96

		this.renderCanvas()
	}

	private handleUp()
	{
		window.removeEventListener( `mouseup`, this.handleUp )

		window.removeEventListener( `touchend`, this.handleUp )

		this.onUp()
	}

	private setCanvasEvents()
	{
		this.canvas.addEventListener( `mousedown`, event =>
		{
			window.addEventListener( `mouseup`, this.handleUp )

			window.addEventListener( `touchend`, this.handleUp )

			this.onDown( event.clientX )
		} )

		this.canvas.addEventListener( `touchstart`, event =>
		{
			window.addEventListener( `mouseup`, this.handleUp )

			window.addEventListener( `touchend`, this.handleUp )

			this.onDown( event.touches[ 0 ].clientX )
		} )

		this.canvas.addEventListener( `mousemove`, event =>
		{
			event.preventDefault()

			event.stopPropagation()

			this.onDrag( event.clientX )
		} )

		this.canvas.addEventListener( `touchmove`, event =>
		{
			event.preventDefault()

			event.stopPropagation()

			this.onDrag( event.touches[ 0 ].clientX )
		} )
	}

	private onDown( start: number )
	{
		if ( this.state !== RangeState.idle ) return

		this.state = RangeState.down

		this.startX = start
	}

	private onUp()
	{
		this.state = this.state === RangeState.slide
			? RangeState.released
			: RangeState.idle

		this.increment = 0

		this.startX = 0

		this.renderCanvas()
	}

	private onDrag( position: number )
	{
		if ( this.state === RangeState.down )
		{
			this.state = RangeState.slide

			this.updateValue()
		}

		if ( this.state !== RangeState.slide ) return

		const { width } = this.canvas

		if ( position > width || position < 0 ) return

		// starting point anywhere from mid to opposite side of direction
		// means 0 is start, 50% of width move is 1000 increment
		// if closer to direction than mid way, percentage shorter
		// is percent limit of maximum value
		// percentage moved from start to edge is * 1000

		const direction = this.startX < position
			? 1
			: this.startX > position
				? -1
				: 0

		if ( direction === 0 )
		{
			this.increment = 0

			return
		}

		const mid = width * 0.5

		const limit = direction === -1
			? this.startX < mid
				? this.startX / mid * ( this.maxIncrement + this.minIncrement )
				: ( this.maxIncrement + this.minIncrement )
			: this.startX > mid
				? ( width - this.startX ) / mid * ( this.maxIncrement + this.minIncrement )
				: ( this.maxIncrement + this.minIncrement )

		const d = direction === -1
			? ( ( position - this.startX ) / this.startX )
			: ( ( position - this.startX ) / ( width - this.startX ) )

		this.increment = d * limit - this.minIncrement
	}

	private flipflop()
	{
		requestAnimationFrame( this.updateValue )
	}
	
	private updateValue()
	{
		if ( this.state === RangeState.released )
		{
			this.state = RangeState.idle

			return
		}

		if ( this.state !== RangeState.slide )
		{
			throw Error( `Range update occuring during invalid state` )
		}

		this.handler.onUIRangeChange( 
			this.type, 
			Math.max( Math.min( this.value + this.increment, this.maxValue ), this.minValue ) )

		this.renderCanvas()

		requestAnimationFrame( this.flipflop )
	}

	private renderCanvas()
	{
		/**
		 * clear
		 */

		this.context2D.clearRect( 0, 0, this.canvas.width, this.canvas.height )

		/**
		 * Draw interactive area
		 */

		this.context2D.globalAlpha = 100 / 255

		this.context2D.fillStyle = `#000000`

		this.context2D.fillRect( 0, 30, this.canvas.width, this.canvas.height - 30 )

		const percent = this.canvas.width * 0.01

		const left = this.increment / this.maxIncrement * ( percent * 15 )

		const blockSize = this.canvas.width * 0.2

		const blocks = [ blockSize * 2, blockSize, blockSize * 2 ]

		/**
		 * Draw hand
		 */

		this.context2D.drawImage( 
			this.imgProvider.handImg(), 
			blocks[ 0 ] + ( blocks[ 1 ] * 0.5 ) - ( 38 * 0.5 ) + left, 
			this.canvas.height - 38 )

		/**
		 * Draw left arrows
		 */

		this.context2D.font = `57px "Courier New", Courier, monospace`

		this.context2D.fillStyle = `#8c9daa`

		const arrowsTop = ( ( this.canvas.height - 30 ) * 0.5 ) + ( this.arrowHeight * 0.5 ) + 30

		this.context2D.fillText( 
			this.leftArrows, 
			blocks[ 0 ] - this.arrowWidth + left, 
			arrowsTop )

		/**
		 * Draw right arrows
		 */

		this.context2D.font = `57px "Courier New", Courier, monospace`

		this.context2D.fillStyle = `#8c9daa`

		this.context2D.fillText( 
			this.rightArrows, 
			blocks[ 0 ] + blocks[ 1 ] + left, 
			arrowsTop )

		/**
		 * Draw numbers
		 */

		this.context2D.globalAlpha = 1

		this.context2D.fillStyle = `#0a0a0a`

		this.context2D.fillRect( 0, 0, this.canvas.width, 30 )

		this.context2D.font = `18px "Courier New", Courier, monospace`

		this.context2D.fillStyle = `#8c9daa`

		this.context2D.fillText( `${this.value}`, 0, 22 )
	}

	public update(): void
	{
		this.renderCanvas()
	}

	public setValue( value: number ): void
	{
		this.value = value
	}

	public onResize(): void
	{
		this.setCanvasSize()
	}
}
import { el, mount, RedomComponent, setChildren } from "redom"

export interface UIRangeNodeHandler<T>
{
	onUIRangeChange: ( id: T, value: number ) => void
}

enum RangeState
{
	locked,
	idle,
	down,
	slide,
	released
}

export class UIRange<T> implements RedomComponent
{
	public el: HTMLElement

	private labelEl: HTMLSpanElement

	private valueEl: HTMLSpanElement

	private interactEl: HTMLElement

	private interactInner: HTMLElement

	private value: number

	private increment: number

	private minIncrement: number

	private maxIncrement: number

	private minValue: number

	private maxValue: number

	private state: RangeState

	private startX: number

	constructor(
		private id: T,
		private handler: UIRangeNodeHandler<T>,
		label: string,
		init = 1
	)
	{
		this.value = init

		this.el = el( `div.rangeChange` )

		const labelP = el( `p` )

		this.labelEl = el( `span`, label )

		mount( labelP, this.labelEl )

		mount( this.el, labelP )

		const valueP = el( `p` )

		this.valueEl = el( `span`, `${init}` )

		mount( valueP, this.valueEl )

		mount( this.el, valueP )

		this.interactEl = el( `div.rangeInteract` )

		this.interactInner = el( `div.rangeInteractInner` )

		mount( this.interactEl, this.interactInner )

		mount( this.el, this.interactEl )

		this.buildInteract()

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

		this.setEvents()
	}

	private handleUp()
	{
		window.removeEventListener( `mouseup`, this.handleUp )

		window.removeEventListener( `touchend`, this.handleUp )

		this.onUp()
	}

	private setEvents()
	{
		this.interactEl.addEventListener( `mousedown`, event =>
		{
			window.addEventListener( `mouseup`, this.handleUp )

			window.addEventListener( `touchend`, this.handleUp )

			this.onDown( event.clientX )
		} )

		this.interactEl.addEventListener( `touchstart`, event =>
		{
			window.addEventListener( `mouseup`, this.handleUp )

			window.addEventListener( `touchend`, this.handleUp )

			this.onDown( event.touches[ 0 ].clientX )
		} )

		this.interactEl.addEventListener( `mousemove`, event =>
		{
			event.preventDefault()

			event.stopPropagation()

			this.onDrag( event.clientX )
		} )

		this.interactEl.addEventListener( `touchmove`, event =>
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

		this.interactInner.removeAttribute( `data-left` )

		this.interactInner.removeAttribute( `style` )
	}

	private onDrag( position: number )
	{
		if ( this.state === RangeState.down )
		{
			this.state = RangeState.slide

			this.updateValue()
		}

		if ( this.state !== RangeState.slide ) return

		const w = this.interactEl.clientWidth

		if ( position > w || position < 0 ) return

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

		const mid = this.interactEl.clientWidth * 0.5

		const limit = direction === -1
			? this.startX < mid
				? this.startX / mid * ( this.maxIncrement + this.minIncrement )
				: ( this.maxIncrement + this.minIncrement )
			: this.startX > mid
				? ( this.interactEl.clientWidth - this.startX ) / mid * ( this.maxIncrement + this.minIncrement )
				: ( this.maxIncrement + this.minIncrement )

		const d = direction === -1
			? ( ( position - this.startX ) / this.startX )
			: ( ( position - this.startX ) / ( this.interactEl.clientWidth - this.startX ) )

		this.increment = d * limit - this.minIncrement
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
			this.id, 
			Math.max( Math.min( this.value + this.increment, this.maxValue ), this.minValue ) )

		const left = this.increment / this.maxIncrement

		this.interactInner.setAttribute( `data-left`, `${left}` )

		this.interactInner.style.left = `${-15 + ( 15 * left )}%`

		requestAnimationFrame( this.updateValue )
	}

	private buildInteract()
	{
		const left = el( `span.left` )

		const hand = el( `span.hand` )

		const right = el( `span.right` )

		setChildren( this.interactInner, [ left, hand, right ] )
	}

	public setValue( value: number ): void
	{
		this.value = value

		this.valueEl.textContent = `${value}`
	}
}
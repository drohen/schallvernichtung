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
	released
}

enum Direction
{
	down = -1,
	up = 1
}

export class UIRange<T> implements RedomComponent
{
	public el: HTMLElement

	private labelEl: HTMLSpanElement

	private numberEl: HTMLParagraphElement

	private decBtn: HTMLButtonElement

	private incBtn: HTMLButtonElement

	private value: number

	private increment: number

	private minValue: number

	private maxValue: number

	private state: RangeState

	private interval: number

	constructor(
		public id: string,
		private type: T,
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

		this.numberEl = el( `div`, { className: `rangeValue` }, `${init}` )

		mount( this.el, this.numberEl )

		const btnWrap = el( `div.rangeBtns` )
		
		this.decBtn = el( `button`, `Less` )

		this.incBtn = el( `button`, `More` )

		setChildren( btnWrap, [ this.decBtn, this.incBtn ] )

		mount( this.el, btnWrap )

		this.interval = 0

		this.increment = 10000

		this.maxValue = 1000001

		this.minValue = 1

		this.state = RangeState.idle

		this.onDown = this.onDown.bind( this )

		this.onUp = this.onUp.bind( this )

		this.handleUp = this.handleUp.bind( this )

		this.setValue = this.setValue.bind( this )

		this.setButtonEvents( this.decBtn, Direction.down )

		this.setButtonEvents( this.incBtn, Direction.up )
	}

	private handleUp()
	{
		window.removeEventListener( `mouseup`, this.handleUp )

		window.removeEventListener( `touchend`, this.handleUp )

		this.onUp()
	}

	private setButtonEvents( button: HTMLButtonElement, direction: Direction )
	{
		button.addEventListener( `mousedown`, event =>
		{
			event.preventDefault()

			window.addEventListener( `mouseup`, this.handleUp )

			window.addEventListener( `touchend`, this.handleUp )

			this.onDown( direction )
		} )

		button.addEventListener( `touchstart`, event =>
		{
			event.preventDefault()

			window.addEventListener( `mouseup`, this.handleUp )

			window.addEventListener( `touchend`, this.handleUp )

			this.onDown( direction )
		} )
	}

	private onDown( direction: Direction )
	{
		if ( this.state !== RangeState.idle ) return

		this.state = RangeState.down

		this.interval = window.setInterval( () =>
		{
			this.handler.onUIRangeChange( 
				this.type, 
				Math.max( Math.min( this.value + ( Math.random() * ( direction * ( this.increment - 1000 ) ) + 1000 ), this.maxValue ), this.minValue ) )
		}, 30 )
	}

	private onUp()
	{
		this.state = RangeState.idle

		clearInterval( this.interval )
	}

	public setValue( value: number ): void
	{
		this.value = value

		this.numberEl.textContent = `${value}`
	}
}
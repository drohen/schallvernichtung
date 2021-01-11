import { el, RedomComponent } from "redom"

export interface ButtonInteractionHandler
{
	onDown?: ( state: string ) => void

	onUp?: ( state: string ) => void

	onLeave?: ( state: string ) => void

	onClick?: ( state: string ) => void
}

enum TouchState
{
	idle,
	start,
	holding
}

export class UIButton implements RedomComponent
{
	private state: string

	private touchTimeout: number

	private touchState: TouchState

	public el: HTMLButtonElement

	constructor(
		private handler: ButtonInteractionHandler,
		private stateLabels: {[state: string]: string},
		initialState: string
	)
	{
		if ( !( initialState in this.stateLabels ) )
		{
			throw Error( `Initial state not available state` )
		}

		this.state = initialState

		this.touchTimeout = 0

		this.touchState = TouchState.idle

		this.touchHold = this.touchHold.bind( this )

		this.el = el( `button`, this.stateLabels[ initialState ] )

		this.onDown = this.onDown.bind( this )

		this.el.addEventListener( `mousedown`, this.onDown )

		this.touchStart = this.touchStart.bind( this )

		this.el.addEventListener( `touchstart`, this.touchStart )

		this.touchEnd = this.touchEnd.bind( this )

		this.el.addEventListener( `touchend`, this.touchEnd )

		this.onUp = this.onUp.bind( this )

		this.el.addEventListener( `mouseup`, this.onUp )

		this.onClick = this.onClick.bind( this )

		this.el.addEventListener( `click`, this.onClick )

		this.onLeave = this.onLeave.bind( this )

		this.el.addEventListener( `mouseleave`, this.onLeave )
	}

	private touchEnd( event: TouchEvent )
	{
		event.preventDefault()

		event.stopPropagation()

		clearTimeout( this.touchTimeout )

		if ( this.touchState === TouchState.holding )
		{
			this.touchState = TouchState.idle

			this.onUp()
		}
		else
		{
			this.touchState = TouchState.idle

			this.onClick()
		}
	}

	private touchHold()
	{
		this.touchState = TouchState.holding
			
		this.onDown()
	}

	private touchStart( event: TouchEvent )
	{
		event.preventDefault()

		event.stopPropagation()

		if ( this.touchState !== TouchState.idle ) return

		this.touchState = TouchState.start

		this.touchTimeout = window.setTimeout( this.touchHold, 100 )
	}

	private onUp( event?: MouseEvent )
	{
		event?.preventDefault()

		this.handler.onUp?.( this.state )
	}

	private onClick( event?: MouseEvent )
	{
		event?.preventDefault()

		this.handler.onClick?.( this.state )
	}

	private onDown( event?: MouseEvent )
	{
		event?.preventDefault()

		this.handler.onDown?.( this.state )
	}

	private onLeave( event?: MouseEvent )
	{
		event?.preventDefault()

		this.handler.onLeave?.( this.state )
	}

	public setState( state: string ): void
	{
		if ( !( state in this.stateLabels ) )
		{
			throw Error( `Setting unavailable button state` )
		}

		this.state = state

		this.el.textContent = this.stateLabels[ this.state ]
	}

	public enable(): void
	{
		this.el.disabled = false
	}

	public disable(): void
	{
		this.el.disabled = true
	}
}
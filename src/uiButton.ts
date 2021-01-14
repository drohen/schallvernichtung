import { el, RedomComponent, mount } from "redom"

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

export enum ButtonCTA
{
	tap,
	hold
}

export class UIButton implements RedomComponent
{
	private state: string

	private touchTimeout: number

	private touchState: TouchState

	private button: HTMLButtonElement

	private label: HTMLSpanElement

	private stateLabels: {[state: string]: string}

	public el: HTMLDivElement

	constructor(
		private handler: ButtonInteractionHandler,
		private _stateLabels: {[state: string]: string},
		private buttonCTA: ButtonCTA = ButtonCTA.tap,
		initialState: string
	)
	{
		if ( !( initialState in this._stateLabels ) )
		{
			throw Error( `Initial state not available state` )
		}

		const maxLabelLength = Object.keys( this._stateLabels ).map( k => k.length ).sort().reverse()[ 0 ]

		this.stateLabels = Object.entries( this._stateLabels ).reduce<{[state: string]: string}>( ( obj, [ k, v ] ) => 
		{
			obj[ k ] = v.padEnd( maxLabelLength )

			return obj
		}, {} )

		this.state = initialState

		this.touchTimeout = 0

		this.touchState = TouchState.idle

		this.touchHold = this.touchHold.bind( this )

		this.el = el( `div`, { className: `labelButton`, style: { maxWidth: `${Math.min( maxLabelLength, 32 )}ch` } } )

		const p = el( `p` )

		this.label = el( `span`, this.stateLabels[ initialState ] )

		mount( p, this.label )

		mount( this.el, p )

		this.button = el( `button` )

		this.setButtonText()

		mount( this.el, this.button )

		this.onDown = this.onDown.bind( this )

		this.button.addEventListener( `mousedown`, this.onDown )

		this.touchStart = this.touchStart.bind( this )

		this.button.addEventListener( `touchstart`, this.touchStart )

		this.touchEnd = this.touchEnd.bind( this )

		this.button.addEventListener( `touchend`, this.touchEnd )

		this.onUp = this.onUp.bind( this )

		this.button.addEventListener( `mouseup`, this.onUp )

		this.onClick = this.onClick.bind( this )

		this.button.addEventListener( `click`, this.onClick )

		this.onLeave = this.onLeave.bind( this )

		this.button.addEventListener( `mouseleave`, this.onLeave )
	}

	private setButtonText( state?: ButtonCTA )
	{
		if ( state !== undefined ) this.buttonCTA = state

		switch( this.buttonCTA )
		{
			case ButtonCTA.tap:

				this.button.textContent = `Tap here`

				break

			case ButtonCTA.hold:

				this.button.textContent = `Hold here`

				break
		}
	}

	private touchEnd( event: TouchEvent )
	{
		event.preventDefault()

		event.stopPropagation()

		clearTimeout( this.touchTimeout )

		if ( this.touchState === TouchState.holding )
		{
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

		this.touchState = TouchState.idle

		this.el.classList.remove( `down` )

		if ( this.buttonCTA !== ButtonCTA.tap ) this.handler.onUp?.( this.state )
	}

	private onClick( event?: MouseEvent )
	{
		event?.preventDefault()

		if ( this.buttonCTA === ButtonCTA.tap ) this.handler.onClick?.( this.state )
	}

	private onDown( event?: MouseEvent )
	{
		event?.preventDefault()

		this.touchState = TouchState.holding

		this.el.classList.add( `down` )

		if ( this.buttonCTA !== ButtonCTA.tap ) this.handler.onDown?.( this.state )
	}

	private onLeave( event?: MouseEvent )
	{
		event?.preventDefault()

		if ( this.touchState === TouchState.holding )
		{
			this.el.classList.remove( `down` )
		}

		if ( this.buttonCTA === ButtonCTA.hold ) this.handler.onLeave?.( this.state )
	}

	public setState( state: string ): void
	{
		if ( !( state in this.stateLabels ) )
		{
			throw Error( `Setting unavailable button state` )
		}

		this.state = state

		this.label.textContent = this.stateLabels[ this.state ]
	}

	public setCTA( state: ButtonCTA ): void
	{
		this.setButtonText( state )
	}

	public enable(): void
	{
		this.button.disabled = false
	}

	public disable(): void
	{
		this.button.disabled = true
	}
}
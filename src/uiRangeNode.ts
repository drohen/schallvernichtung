import { el, RedomComponent } from "redom"

export interface UIRangeNodeHandler<T>
{
	onUIRangeChange: ( id: T, value: number ) => void
}

export class UIRange<T> implements RedomComponent
{
	public el: HTMLInputElement

	private debounce: number

	private debounceCount: number

	constructor(
		private id: T,
		private handler: UIRangeNodeHandler<T>,
		init: `min` | `max` | `mid` | number = `min`
	)
	{
		const value = typeof init === `number` ? init : init === `max` ? 101 : init === `mid` ? 51 : 1

		this.el = el( `input`, { type: `range`, value, min: 1, max: 101, step: 0.0001 } )

		this.debounceOnChange = this.debounceOnChange.bind( this )

		this.el.addEventListener( `input`, this.debounceOnChange )

		this.debounce = 0

		this.debounceCount = 0
	}

	private debounceOnChange()
	{
		this.debounceCount += 1

		clearTimeout( this.debounce )

		if ( this.debounceCount >= 50 )
		{
			this.debounceCount = 0

			this.handler.onUIRangeChange( this.id, parseFloat( this.el.value ) )
		}

		this.debounce = window.setTimeout( () => this.handler.onUIRangeChange( this.id, parseFloat( this.el.value ) ), 30 )
	}

	public setValue( value: number ): void
	{
		this.el.value = `${value}`
	}
}
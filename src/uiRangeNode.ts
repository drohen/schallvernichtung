import { el, RedomComponent } from "redom"
import { AudioNodeExtension } from "./audioNodeExt"

export interface RangeCoreProvider
{
	context: AudioContext
}

export class UIRangeNode extends AudioNodeExtension implements RedomComponent
{
	public el: HTMLInputElement

	private debounce: number

	private debounceCount: number

	constructor(
		id: string,
		protected core: RangeCoreProvider,
		init: `min` | `max` | `mid` | number = `min`
	)
	{
		super( id )

		const value = typeof init === `number` ? init : init === `max` ? 101 : init === `mid` ? 51 : 1

		this.el = el( `input`, { type: `range`, value, min: 1, max: 101, step: 0.0001 } )

		this.debounceOnChange = this.debounceOnChange.bind( this )

		this.el.addEventListener( `input`, this.debounceOnChange )

		this.debounce = 0

		this.debounceCount = 0
	}

	protected logRange( position: number, min: number, max: number, findPosition?: boolean ): number
	{
		if ( max <= min ) return min

		const minp = 1

		const maxp = 101

		const signSwitch = min < 0 && max < 0

		const nMin = signSwitch
			? min * -1 + 1
			: min <= 0
				? ( -1 * min + 1 )
				: min + 1

		const nMax = signSwitch
			? max * -1 + 1
			: min <= 0
				? max + nMin
				: max + 1

		const minv = Math.log( nMin )

		const maxv = Math.log( nMax )

		const scale = ( maxv - minv ) / ( maxp - minp )

		return findPosition
			// position var is actually the value we want to find the position between min and max for
			? ( ( Math.log( ( position / ( signSwitch ? -1 : 1 ) ) + ( signSwitch || min > 0 ? 1 : nMin ) ) - minv ) / scale ) + minp
			: ( Math.exp( minv + scale * ( position - minp ) ) - ( signSwitch || min > 0 ? 1 : nMin ) ) * ( signSwitch ? -1 : 1 )
	}

	private debounceOnChange()
	{
		this.debounceCount += 1

		clearTimeout( this.debounce )

		if ( this.debounceCount >= 50 )
		{
			this.debounceCount = 0

			this.onChange( parseFloat( this.el.value ) )
		}

		this.debounce = window.setTimeout( () => this.onChange( parseFloat( this.el.value ) ), 30 )
	}

	protected onChange( value: number ): void
	{
		// Override this fn
		throw Error( `Override on change, output value is ${value}` )
	}

	protected ramp( param: AudioParam, to: number ): void
	{
		param.linearRampToValueAtTime( to, this.core.context.currentTime + 0.5 )
	}
}
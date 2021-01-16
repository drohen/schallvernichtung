import type { SampleNodeMathProvider } from "./sampleNode"
import type { UISampleCoreProvider } from "./uiSample"

export class MathUtility implements UISampleCoreProvider, SampleNodeMathProvider
{
	private logRange( position: number, min: number, max: number, findPosition?: boolean ): number
	{
		if ( max <= min ) return min

		const minp = 1

		const maxp = 1000001

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

	public getPositionForLogRangeValue( value: number, min: number, max: number ): number
	{
		return this.logRange( value, min, max, true )
	}

	public exponentialValueInRange( position: number, min: number, max: number ): number
	{
		return this.logRange( position, min, max )
	}
}

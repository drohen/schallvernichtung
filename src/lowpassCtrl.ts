import { RangeNodeUI, RangeCoreProvider } from "./rangeNodeUI"

export class LowpassControl extends RangeNodeUI
{
	private node: BiquadFilterNode

	constructor(
		core: RangeCoreProvider
	)
	{
		super( `Lowpass`, core )

		this.node = this.core.context.createBiquadFilter()

		this.setInput( this.node )

		this.setOutput( this.node )

		this.node.frequency.value = 6000

		this.node.type = `lowpass`
	}

	protected onChange( value: number ): void
	{
		this.ramp( this.node.frequency, 6000 - this.logRange( value, 0, 5950 * 0.005 ) * 200 )
	}
}
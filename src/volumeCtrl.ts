import { RangeNodeUI, RangeCoreProvider } from "./rangeNodeUI"

export class VolumeControl extends RangeNodeUI
{
	private node: GainNode

	constructor(
		core: RangeCoreProvider
	)
	{
		super( `Volume`, core, `mid` )

		this.node = this.core.context.createGain()

		this.setInput( this.node )

		this.setOutput( this.node )

		this.node.gain.setValueAtTime( this.logRange( 51, 0, 3 ), this.core.context.currentTime )
	}

	protected onChange( value: number ): void
	{
		this.ramp( this.node.gain, this.logRange( value, 0, 3 ) )
	}
}
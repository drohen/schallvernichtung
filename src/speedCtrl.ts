import { RangeNodeUI, RangeCoreProvider } from "./rangeNodeUI"

export class SpeedControl extends RangeNodeUI
{
	constructor(
		core: RangeCoreProvider,
		private node: AudioBufferSourceNode
	)
	{
		super( `Speed`, core )

		this.setInput( this.node )

		this.setOutput( this.node )

		this.el.value = `${this.logRange( 1, 0.1, 3, true )}`
	}

	protected onChange( value: number ): void
	{
		this.ramp( this.node.playbackRate, this.logRange( value, 0.1, 3 ) )
	}
}
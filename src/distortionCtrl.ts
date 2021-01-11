import { UIRangeNode, RangeCoreProvider } from "./uiRangeNode"

export class DistortionControl extends UIRangeNode
{
	private curveData: Float32Array

	private node: WaveShaperNode

	constructor(
		core: RangeCoreProvider
	)
	{
		super( `Distortion`, core )

		this.node = this.core.context.createWaveShaper()

		this.setInput( this.node )

		this.setOutput( this.node )

		this.node.oversample = `4x`

		this.curveData = new Float32Array( this.core.context.sampleRate )

		this.curve( 0 )

		this.node.curve = this.curveData
	}

	private curve( amount: number )
	{
		const k = typeof amount === `number` ? amount : 50

		const deg = Math.PI / 180

		let x = 0

		for ( let i = 0; i < this.core.context.sampleRate; ++i ) 
		{
			x = i * 2 / this.core.context.sampleRate - 1

			this.curveData[ i ] = ( 10 + k ) * x * 50 * deg / ( Math.PI + k * Math.abs( x ) )
		}
	}

	protected onChange( value: number ): void
	{
		this.curve( ~~this.logRange( value, 0, 10000 ) )

		this.node.curve = this.curveData
	}
}
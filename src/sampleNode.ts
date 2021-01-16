import { AudioNodeManager, AudioNodeManagerContext } from "./audioNodeExt"
import { SampleEntity, SampleState, SampleUINodeID } from "./sampleEntity"

export interface SampleNodeAudioProvider
{
	context: () => AudioContext
}

export interface SampleNodeMathProvider
{
	exponentialValueInRange: ( position: number, min: number, max: number ) => number
}

export class SampleNode implements SampleEntity, AudioNodeManagerContext
{
	public audioNodeManager: AudioNodeManager

	public isAudioNodeManaged: true

	public isSampleEntity: true

	private bufferNode: AudioBufferSourceNode

	private volumeNode: GainNode
	
	private lowpassFilterNode: BiquadFilterNode

	private distortionFilterNode: WaveShaperNode

	private distortionCurveData: Float32Array

	private compressorGainNode: GainNode

	private compressorFilterNode: DynamicsCompressorNode

	constructor(
		public id: string,
		private core: SampleNodeAudioProvider,
		private math: SampleNodeMathProvider,
		data: Float32Array
	)
	{
		this.audioNodeManager = new AudioNodeManager( id )

		this.isAudioNodeManaged = true

		this.isSampleEntity = true


		/**
		 * Buffer
		 * Root node, no input connection
		 */

		const buffer = this.core.context().createBuffer( 1, data.length, this.core.context().sampleRate )

		this.bufferNode = this.core.context().createBufferSource()

		buffer.copyToChannel( data, 0 )

		this.bufferNode.buffer = buffer

		this.bufferNode.loop = true
		

		/**
		 * Volume control
		 */

		this.volumeNode = this.core.context().createGain()

		this.volumeNode.gain.setValueAtTime( this.math.exponentialValueInRange( 500001, 0, 3 ), this.core.context().currentTime )

		this.audioNodeManager.setOutput( this.volumeNode )
		
		/**
		 * Low pass filter
		 */

		this.lowpassFilterNode = this.core.context().createBiquadFilter()

		this.lowpassFilterNode.frequency.value = 6000

		this.lowpassFilterNode.type = `lowpass`

		this.lowpassFilterNode.connect( this.volumeNode )


		/**
		 * Distortion filter
		 */

		this.distortionFilterNode = this.core.context().createWaveShaper()

		this.distortionFilterNode.oversample = `4x`

		this.distortionCurveData = new Float32Array( this.core.context().sampleRate )

		this.curve( 0 )

		this.distortionFilterNode.curve = this.distortionCurveData

		this.distortionFilterNode.connect( this.lowpassFilterNode )


		/**
		 * Compressor filter
		 */

		this.compressorGainNode = this.core.context().createGain()

		this.compressorGainNode.gain.setValueAtTime( -1, this.core.context().currentTime )

		this.compressorFilterNode = this.core.context().createDynamicsCompressor()

		this.compressorGainNode.connect( this.compressorFilterNode )

		this.compressorFilterNode.threshold.setValueAtTime( -10, this.core.context().currentTime )

		this.compressorFilterNode.knee.setValueAtTime( 4, this.core.context().currentTime )

		this.compressorFilterNode.ratio.setValueAtTime( 2, this.core.context().currentTime )

		this.compressorFilterNode.attack.setValueAtTime( 0, this.core.context().currentTime )

		this.compressorFilterNode.release.setValueAtTime( 0.1, this.core.context().currentTime )

		this.compressorFilterNode.connect( this.distortionFilterNode )
	}

	private curve( amount: number )
	{
		const k = typeof amount === `number` ? ~~amount : 50

		const deg = Math.PI / 180

		let x = 0

		for ( let i = 0; i < this.core.context().sampleRate; ++i ) 
		{
			x = i * 2 / this.core.context().sampleRate - 1

			this.distortionCurveData[ i ] = ( 10 + k ) * x * 50 * deg / ( Math.PI + k * Math.abs( x ) )
		}
	}

	private ramp( param: AudioParam, to: number, time: number ): void
	{
		param.linearRampToValueAtTime( to, time )
	}

	private rampTime(): number
	{
		return this.core.context().currentTime + 0.5
	}

	private setCompressor( value: number )
	{
		this.ramp( this.compressorGainNode.gain, this.math.exponentialValueInRange( value, -1, -1 ), this.rampTime() )

		this.ramp( this.compressorFilterNode.threshold, 0 - this.math.exponentialValueInRange( value, 10, 100 ), this.rampTime() )

		this.ramp( this.compressorFilterNode.knee, this.math.exponentialValueInRange( value, 4, 40 ), this.rampTime() )

		this.ramp( this.compressorFilterNode.ratio, this.math.exponentialValueInRange( value, 2, 20 ), this.rampTime() )

		this.ramp( this.compressorFilterNode.release, Math.pow( 20, -1 * this.math.exponentialValueInRange( value, 1, 1000 ) ), this.rampTime() )
	}

	private setDistortion( value: number )
	{
		this.curve( this.math.exponentialValueInRange( value, 0, 10000 ) )

		this.distortionFilterNode.curve = this.distortionCurveData
	}

	private setLowpass( value: number )
	{
		this.ramp( this.lowpassFilterNode.frequency, 6000 - this.math.exponentialValueInRange( value, 0, 5950 * 0.005 ) * 200, this.rampTime() )
	}

	private setSpeed( value: number )
	{
		this.ramp( this.bufferNode.playbackRate, this.math.exponentialValueInRange( value, 0.1, 3 ), this.rampTime() )
	}

	private setVolume( value: number )
	{
		this.ramp( this.volumeNode.gain, this.math.exponentialValueInRange( value, 0, 3 ), this.rampTime() )
	}

	public onSampleStateChanged( sampleID: string, state: SampleState, previous: SampleState ): void
	{
		if ( sampleID !== this.id ) return

		switch( state )
		{
			case SampleState.playing:

				if ( previous === SampleState.notStarted )
				{
					this.bufferNode.start()
				}

				this.bufferNode.connect( this.compressorGainNode )

				break

			case SampleState.paused:

				this.bufferNode.disconnect( this.compressorGainNode )

				break
		}
	}

	public onSampleError( error: Error ): void
	{
		// TODO: stop/disconnect sample?
	}

	public onSampleNodeValueChange( sampleID: string, nodeID: SampleUINodeID, value: number ): void
	{
		if ( sampleID !== this.id ) return

		switch( nodeID )
		{
			case SampleUINodeID.compressor:

				this.setCompressor( value )

				break
	
			case SampleUINodeID.distortion:

				this.setDistortion( value )

				break
	
			case SampleUINodeID.lowpass:

				this.setLowpass( value )

				break
	
			case SampleUINodeID.speed:

				this.setSpeed( value )

				break
	
			case SampleUINodeID.volume:

				this.setVolume( value )

				break
		}
	}

	public onSampleSelectedChanged(): void
	{
		// do nothing
	}

	public onSampleCreated(): void
	{
		// do nothing
	}
}
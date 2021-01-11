
export interface SampleCoreProvider
{
	context: AudioContext

	onSampleAdd: ( index: number ) => void

	onLabelChange: ( index: number ) => void
}

enum SampleState
{
	notStarted,
	paused,
	playing,
}

export interface Sample
{
	node: AudioBufferSourceNode
	label: string
	state: SampleState
}

export class SampleBank
{
	private samples: Sample[]

	constructor(
		private core: SampleCoreProvider,
		private channels: number
	)
	{
		this.samples = []
	}

	public create( data: Float32Array ): void
	{
		if ( data.length < this.core.context.sampleRate * 0.2 ) return

		const buffer = this.core.context.createBuffer( this.channels, data.length, this.core.context.sampleRate )

		const node = this.core.context.createBufferSource()

		buffer.copyToChannel( data, 0 )

		node.buffer = buffer

		node.loop = true

		const index = this.samples.length

		this.samples.push( {
			label: `Sample ${( new Date() ).toUTCString()}`,
			node,
			state: SampleState.notStarted
		} )

		this.core.onSampleAdd( index )
	}

	public play( index: number ): void
	{
		if ( this.samples[ index ].state === SampleState.playing ) return

		const start = this.samples[ index ].state === SampleState.notStarted
		
		this.samples[ index ].state = SampleState.playing

		if ( start ) this.samples[ index ].node.start()
	}

	public pause( index: number ): void
	{
		if ( this.samples[ index ].state === SampleState.paused ) return
		
		this.samples[ index ].state = SampleState.paused
	}

	public setLabel( index: number, label: string ): void
	{
		this.samples[ index ].label = label

		this.core.onLabelChange( index )
	}

	public setPlaybackSpeed( index: number, value: number ): void
	{
		this.samples[ index ].node.playbackRate.linearRampToValueAtTime( value, this.core.context.currentTime + 10 )
	}

	public node( index: number ): AudioBufferSourceNode
	{
		return this.samples[ index ].node
	}

	public label( index: number ): string
	{
		return this.samples[ index ].label
	}
}
enum BufferState
{
	preparing,
	recording,
	idle
}

export interface RecordedBufferHandler
{
	onRecorded: ( data: Float32Array ) => void
}

export class RecordBuffer
{
	private state: BufferState

	private recordingLength: number

	private bufferSize: number

	private buffer: Float32Array

	private prepCounter: number

	constructor(
		private sampleRate: number,
		private maxLength: number,
		private chunkSize: number,
		private handler: RecordedBufferHandler
	)
	{
		this.state = BufferState.idle

		this.bufferSize = this.sampleRate * this.maxLength

		this.recordingLength = 0

		this.buffer = new Float32Array( this.bufferSize )

		this.onChunk = this.onChunk.bind( this )

		this.prepCounter = 0
	}

	public record(): void
	{
		if ( this.isRecording() ) return

		this.recordingLength = 0

		this.state = BufferState.recording
	}

	public onChunk( chunk: Float32Array ): void
	{
		if ( this.state === BufferState.preparing )
		{
			if ( this.prepCounter > 10 )
			{
				this.state = BufferState.recording

				this.prepCounter = 0
			}
			else
			{
				this.prepCounter += 1
			}
	
			return
		}

		if ( chunk[ 0 ] === 0 && chunk[ 1 ] === 0 && chunk[ 2 ] === 0 )
		{
			return
		}

		this.buffer.set( chunk, this.recordingLength )

		this.recordingLength += chunk.length
	}

	public stopRecord(): void
	{
		if ( !this.isRecording() ) return

		this.state = BufferState.idle

		this.recordingLength -= this.chunkSize

		this.handler.onRecorded( this.buffer.subarray( 0, this.recordingLength ) )
	}

	public isRecording(): boolean
	{
		return this.state === BufferState.recording
			|| this.state === BufferState.preparing
	}
}
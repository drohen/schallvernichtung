import type { RecordingWorkerChunkMessage, RecordingWorkerCloseMessage, RecordingWorkerInitMessage, RecordingWorkerStartMessage, RecordingWorkerStopMessage } from "./recordingEntity"

enum WorkletState
{
	closed,
	initing,
	recording,
	stopped
}

type MessageData = 
	| RecordingWorkerInitMessage
	| RecordingWorkerCloseMessage
	| RecordingWorkerStartMessage
	| RecordingWorkerChunkMessage
	| RecordingWorkerStopMessage

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

export class RecordingWorklet extends AudioWorkletProcessor implements RecordedBufferHandler
{
	private buffer?: RecordBuffer

	private state: WorkletState

	constructor()
	{
		super()

		this.state = WorkletState.closed

		this.handleData = this.handleData.bind( this )

		this.onRecorded = this.onRecorded.bind( this )

		this.port.onmessage = this.handleData
	}

	private handleData( { data }: MessageEvent<MessageData> ) 
	{
		if ( this.buffer ) 
		{
			switch( data.command )
			{
				case `start`:

					if ( this.state !== WorkletState.initing )
					{
						throw Error( `Can't start worklet` )
					}

					this.state = WorkletState.recording

					this.buffer.record()

					this.port.postMessage( { message: `recording` } )

					break

				case `stop`:

					if ( this.state !== WorkletState.recording )
					{
						throw Error( `Can't stop worklet` )
					}

					this.buffer.stopRecord()

					break

				default:
					
					break
			}
		}

		switch( data.command )
		{
			case `close`:

				this.close()
				
				break

			case `init`:

				if ( this.state !== WorkletState.closed )
				{
					throw Error( `Can't init worklet` )
				}

				this.state = WorkletState.initing

				// frames from audioworklets are always 128
				this.buffer = new RecordBuffer( data.data.sampleRate, data.data.maxLength, 128, this )
		
				this.port.postMessage( { message: `ready` } )

				break

			default:

				break
		}
	}

	private close()
	{
		this.state = WorkletState.closed

		this.buffer = undefined
	}

	public onRecorded( data: Float32Array ): void
	{
		this.state = WorkletState.stopped

		this.port.postMessage( { message: `done`, buffer: data }, [ data.buffer ] )

		this.close()
	}

	/**
	 * 
	 * @param inputs inputs[n][m][i] will access n-th input, m-th channel of that input, and i-th sample of that channel.
	 */
	public process( inputs: Float32Array[][] ): boolean
	{
		if ( this.buffer && inputs[ 0 ] && inputs[ 0 ].length && inputs[ 0 ][ 0 ] && inputs[ 0 ][ 0 ].length )
		{
			this.buffer.onChunk( inputs[ 0 ][ 0 ] )
		}

		return this.state === WorkletState.recording
	}
}	

// Run in AudioWorkletGlobal scope
if ( typeof registerProcessor === `function` ) 
{
	registerProcessor( `recording-worklet`, RecordingWorklet )
}
      
// run in scriptProcessor worker scope
else 
{
	let encoder: RecordBuffer | undefined

	const closeWorker = () =>
	{
		encoder = undefined

		close()
	}

	const bufferHandler: RecordedBufferHandler = {
		onRecorded: ( data: Float32Array ) =>
		{
			postMessage( { message: `done`, buffer: data }, [ data.buffer ] )

			closeWorker()
		}
	}
	
	onmessage = ( { data }: MessageEvent<MessageData> ) => 
	{
		if ( encoder ) 
		{
			switch( data.command )
			{
				case `start`:

					encoder.record()

					postMessage( { message: `recording` } )

					break
			
				case `chunk`:

					encoder.onChunk( data.buffer )

					break

				case `stop`:

					encoder.stopRecord()

					break

				default:
					
					break
			}
		}

		switch( data.command )
		{
			case `close`:

				closeWorker()

				break

			case `init`:

				encoder = new RecordBuffer( data.data.sampleRate, data.data.maxLength, data.data.chunkSize, bufferHandler )
		
				postMessage( { message: `ready` } )

				break

			default:
					
				break
		}
	}
}
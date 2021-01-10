import { RecordBuffer, RecordedBufferHandler } from "./recordBuff"
import type { RecordingWorkerCloseMessage, RecordingWorkerInitMessage, RecordingWorkerStartMessage, RecordingWorkerStopMessage } from "./recordingEntity"

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
	| RecordingWorkerStopMessage

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

					break

				case `stop`:
					if ( this.state !== WorkletState.recording )
					{
						throw Error( `Can't stop worklet` )
					}

					this.state = WorkletState.stopped

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

		this.port.postMessage( { message: `done` }, [ data ] )

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
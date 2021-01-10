import { RecordBuffer, RecordedBufferHandler } from "./recordBuff"
import type { RecordingWorkerChunkMessage, RecordingWorkerCloseMessage, RecordingWorkerInitMessage, RecordingWorkerStartMessage, RecordingWorkerStopMessage } from "./recordingEntity"
import { RecordingWorklet } from "./recordingWorklet"

type MessageData = 
	| RecordingWorkerInitMessage
	| RecordingWorkerCloseMessage
	| RecordingWorkerStartMessage
	| RecordingWorkerChunkMessage
	| RecordingWorkerStopMessage

// Run in AudioWorkletGlobal scope
if ( typeof registerProcessor === `function` ) 
{
	registerProcessor( `recording-worklet`, RecordingWorklet )
}
      
// run in scriptProcessor worker scope
else 
{
	let encoder: RecordBuffer

	const bufferHandler: RecordedBufferHandler = {
		onRecorded: ( data: Float32Array ) =>
		{
			postMessage( { message: `ready` }, [ data ] )
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
				close()

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
import type { Entity } from "./entity"
import type { RecordButtonHandler } from "./recordBtn"
import { RecordingEntity, RecordingState, RecordingWorkerChunkMessage, RecordingWorkerCloseMessage, RecordingWorkerInitMessage, RecordingWorkerStartMessage, RecordingWorkerStopMessage } from "./recordingEntity"

/**
 * Recording system will manage the APIs responsible
 * for handling the audio captured from a user.
 * 
 * It answers the questions:
 * - Do we have access to some input device?
 * - Are we recording?
 * - Where do we store the recording data?
 * - How do we handle the recorded data?
 */
export interface RecordingSystemCoreProvider
{
	context: AudioContext

	entities: Entity[]

	/**
	 * Handle stream then return promise so the button
	 * can update its state to handle recording button
	 * click to start recording
	 */
	handleStream: ( stream: MediaStream ) => Promise<void>
}

type WorkerMessage = 
	| RecordingWorkerInitMessage
	| RecordingWorkerCloseMessage
	| RecordingWorkerStartMessage
	| RecordingWorkerChunkMessage
	| RecordingWorkerStopMessage

export class RecordingHandler implements RecordButtonHandler
{
	private recorderNode?: AudioWorkletNode | ScriptProcessorNode

	private mediaTracks: MediaStreamTrack[]

	private recorder?: MessagePort | Worker

	private state: RecordingState

	constructor(
		private core: RecordingSystemCoreProvider,
		private workerPath: string,
		private chunkSize: number,
		recordLength: number
	)
	{
		this.mediaTracks = []

		this.addWorkletScript().then( this.addRecorder )

		this.state = RecordingState.noDevice

		this.handleRecorderMessage = this.handleRecorderMessage.bind( this )
	}

	private addRecorder()
	{
		if ( this.core.context.audioWorklet ) 
		{
			this.recorderNode = new AudioWorkletNode( this.core.context, `recording-worklet`, { numberOfOutputs: 0 } )

			this.recorder = this.recorderNode.port
		}
		else 
		{
			this.recorderNode = this.core.context.createScriptProcessor( this.chunkSize, 1, 1 )

			this.processChunk = this.processChunk.bind( this )

			this.recorderNode.addEventListener( `audioprocess`, this.processChunk )

			this.recorderNode.connect( this.core.context.destination )

			this.recorder = new Worker( this.workerPath )
		}

		this.recorder.onmessage = this.handleRecorderMessage
	}

	private handleRecorderMessage( event: MessageEvent )
	{
		//
	}

	private async addWorkletScript()
	{
		if ( this.core.context.audioWorklet ) 
		{
			this.core.context.audioWorklet.addModule( this.workerPath )
		}
	}

	private processChunk( event: AudioProcessingEvent )
	{
		this.postRecorder( { command: `chunk`, buffer: event.inputBuffer.getChannelData( 0 ) } )
	}

	private isRecordingEntity( entity: Entity | RecordingEntity ): entity is RecordingEntity
	{
		return `isRecordingEntity` in entity && entity.isRecordingEntity
	}

	private postRecorder( message: WorkerMessage )
	{
		this.recorder?.postMessage( message )
	}

	private shiftState( state: RecordingState ): boolean
	{
		if ( state === this.state ) return false

		switch( state )
		{
			case RecordingState.closing:

				if ( this.state !== RecordingState.recording ) return false

				this.state = RecordingState.closing

				return true

			case RecordingState.error:

				this.state = RecordingState.error

				return true

			case RecordingState.idle:

				if ( this.state !== RecordingState.closing ) return false

				this.state = RecordingState.idle

				return true

			case RecordingState.noDevice:

				if ( this.state !== RecordingState.error ) return false

				this.state = RecordingState.noDevice

				return true

			case RecordingState.recording:

				if ( this.state !== RecordingState.starting ) return false

				this.state = RecordingState.recording

				return true

			case RecordingState.requestingDevice:

				if ( this.state !== RecordingState.noDevice ) return false

				this.state = RecordingState.requestingDevice

				this.getCapture()

				return true

			case RecordingState.starting:

				if ( this.state !== RecordingState.idle ) return false

				this.state = RecordingState.starting

				return true
		}
	}

	private emit( emitType: `state` | `error`, state?: RecordingState, error?: Error )
	{
		if ( ( emitType === `state` && state ) && !this.shiftState( state ) ) return

		for ( let i = 0; i < this.core.entities.length; i++ )
		{
			const entity = this.core.entities[ i ]

			if ( this.isRecordingEntity( entity ) )
			{
				if ( emitType === `state` && state )
				{
					entity.onRecordingStateChanged( state )
				}
				else if ( emitType === `error` && error )
				{
					entity.onRecordingError( error )
				}
			}
		}
	}
	
	private getCapture()
	{
		navigator.mediaDevices
			.getUserMedia( {
				audio: {
					autoGainControl: false,
					echoCancellation: false,
					noiseSuppression: false
				},
				video: false
			} )
			.then( stream =>
			{
				this.mediaTracks.push( ...stream.getAudioTracks() )

				return this.core.handleStream( stream )
			} )
			.then( () => this.emit( `state`, RecordingState.idle ) )
			.catch( ( error: Error ) => this.emit( `error`, undefined, error ) )
	}

	public recordButtonOnStart(): void
	{
		this.emit( `state`, RecordingState.starting )

		// the recording worker/buffer system should now
		// alert when recording has started
	}

	public recordButtonOnStop(): void
	{
		this.emit( `state`, RecordingState.closing )

		// the recording worker/buffer system should now
		// alert when recording has stopped
	}

	public recordButtonOnReload(): void
	{
		for( let i = 0; i < this.mediaTracks.length; i++ )
		{
			this.mediaTracks[ i ].stop()
		}

		this.mediaTracks.length = 0

		this.emit( `state`, RecordingState.noDevice )
	}

}
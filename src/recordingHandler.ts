import type { Entity } from "./entity"
import type { UIRecordButtonHandler } from "./uiRecordBtn"
import { 
	RecordingEntity, 
	RecordingState, 
	RecordingWorkerChunkMessage, 
	RecordingWorkerCloseMessage, 
	RecordingWorkerInitMessage, 
	RecordingWorkerStartMessage, 
	RecordingWorkerStopMessage, 
	RecordingWorkerOutputBufferMessage, 
	RecordingWorkerOutputReadyMessage,
	RecordingWorkerOutputRecordingMessage
} from "./recordingEntity"
import type { AudioNodeManagerContext } from "./audioNodeExt"

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
	entities: () => Entity[]
}

export interface RecordingSystemHandler
{
	onRecorded: ( buffer: Float32Array ) => void
}

export interface AudioContextProvider
{
	context: () => AudioContext
	
	getRecorderNode: () => AudioNodeManagerContext

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

type WorkerOutputMessage = 
	| RecordingWorkerOutputBufferMessage 
	| RecordingWorkerOutputReadyMessage
	| RecordingWorkerOutputRecordingMessage

export class RecordingHandler implements UIRecordButtonHandler
{
	private recorderNode?: AudioWorkletNode | ScriptProcessorNode

	private mediaTracks: MediaStreamTrack[]

	private recorder?: MessagePort | Worker

	private state: RecordingState

	constructor(
		private core: RecordingSystemCoreProvider,
		private audio: AudioContextProvider,
		private workerPath: string,
		private chunkSize: number,
		private recordLength: number,
		private handler: RecordingSystemHandler
	)
	{
		this.mediaTracks = []

		this.state = RecordingState.noDevice

		this.handleRecorderMessage = this.handleRecorderMessage.bind( this )

		this.appReady = this.appReady.bind( this )

		if ( this.audio.context().audioWorklet ) 
		{
			this.audio.context().audioWorklet.addModule( this.workerPath )
				.catch( error => this.emit( `error`, undefined, error ) )
		}
		else
		{
			this.recorderNode = this.audio.context().createScriptProcessor( this.chunkSize, 1, 1 )

			this.processChunk = this.processChunk.bind( this )

			this.recorderNode.addEventListener( `audioprocess`, this.processChunk )

			this.recorderNode.connect( this.audio.context().destination )
		}
	}

	private setRecorder()
	{
		if ( this.audio.context().audioWorklet ) 
		{
			this.recorderNode = new AudioWorkletNode( 
				this.audio.context(), 
				`recording-worklet`, 
				{ numberOfOutputs: 0, numberOfInputs: 1 } )

			if ( !this.recorderNode )
			{
				throw Error( `No recording node available to connect` )
			}
	
			this.audio.getRecorderNode().audioNodeManager.connectOutput( this.recorderNode )

			this.recorder = this.recorderNode.port
		}
		else 
		{
			this.recorder = new Worker( 
				new URL( this.workerPath, import.meta.url ), 
				{ name: `recording-worker`, type: `module` } )
		}

		this.recorder.onmessage = this.handleRecorderMessage

		this.postRecorder( {
			command: `init`,
			data: {
				chunkSize: this.chunkSize,
				maxLength: this.recordLength,
				sampleRate: this.audio.context().sampleRate,
			}
		} )
	}

	private unsetRecorder()
	{
		if ( this.audio.context().audioWorklet ) 
		{
			if ( !this.recorderNode )
			{
				throw Error( `No recording node available to disconnect` )
			}
	
			this.audio.getRecorderNode().audioNodeManager.disconnectOutput( this.recorderNode )
		}

		this.recorder = undefined
	}

	private handleRecorderMessage( event: MessageEvent<WorkerOutputMessage> )
	{
		switch ( event.data.message )
		{
			case `ready`:

				this.emit( `state`, RecordingState.ready )
				
				break

			case `recording`:

				this.emit( `state`, RecordingState.recording )

				break

			case `done`:

				this.unsetRecorder()

				this.emit( `state`, RecordingState.idle )

				if ( event.data.buffer.length >= this.audio.context().sampleRate * 0.2 )
				{
					this.handler.onRecorded( event.data.buffer )
				}

				break
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

				this.postRecorder( { command: `stop` } )

				return true

			case RecordingState.error:

				this.state = RecordingState.error

				return true

			case RecordingState.streamInitiated:

				if ( this.state !== RecordingState.requestingDevice ) return false

				this.state = RecordingState.streamInitiated

				return true

			case RecordingState.idle:

				if ( this.state !== RecordingState.closing
					&& this.state !== RecordingState.streamInitiated ) return false

				this.state = RecordingState.idle

				return true

			case RecordingState.noDevice:

				if ( this.state !== RecordingState.error ) return false

				this.state = RecordingState.noDevice

				return true

			case RecordingState.recording:

				if ( this.state !== RecordingState.ready ) return false

				this.state = RecordingState.recording

				return true

			case RecordingState.requestingDevice:

				if ( this.state !== RecordingState.noDevice ) return false

				this.state = RecordingState.requestingDevice

				this.getCapture()

				return true

			case RecordingState.ready:

				if ( this.state !== RecordingState.starting ) return false

				this.state = RecordingState.ready

				this.postRecorder( { command: `start` } )

				return true

			case RecordingState.starting:

				if ( this.state !== RecordingState.idle ) return false

				this.state = RecordingState.starting

				this.setRecorder()

				return true
		}
	}

	private emit( emitType: `state` | `error`, state?: RecordingState, error?: Error )
	{
		if ( ( emitType === `state` && state !== undefined ) && !this.shiftState( state ) ) return

		for ( let i = 0; i < this.core.entities().length; i++ )
		{
			const entity = this.core.entities()[ i ]

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

				return this.audio.handleStream( stream )
			} )
			.then( () => this.emit( `state`, RecordingState.streamInitiated ) )
			.catch( ( error: Error ) => this.emit( `error`, undefined, error ) )
	}

	public recordButtonOnStart(): void
	{
		this.emit( `state`, RecordingState.starting )
	}

	public recordButtonOnStop(): void
	{
		this.emit( `state`, RecordingState.closing )
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

	public recordButtonOnRequest(): void
	{
		this.emit( `state`, RecordingState.requestingDevice )
	}

	public appReady(): void
	{
		this.emit( `state`, RecordingState.idle )
	}
}
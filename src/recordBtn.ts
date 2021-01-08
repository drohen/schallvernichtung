import { el, RedomComponent } from "redom"

enum RecordingState
{
	noDevice,
	requestingDevice,
	idle,
	starting,
	recording,
	closing,
	error
}

export interface RecordHandler
{
	/**
	 * Handle stream then return promise so the button
	 * can update its state to handle recording button
	 * click to start recording
	 */
	handleStream: ( stream: MediaStream ) => Promise<void>

	onError: () => void

	startRecording: () => Promise<void>

	stopRecording: () => Promise<void>

	reloadContext: () => Promise<void>
}

export class RecordBtn implements RedomComponent
{
	public el: HTMLButtonElement

	private state: RecordingState

	private error?: Error

	private mediaTracks: MediaStreamTrack[]

	private recordingTimeout: number

	constructor(
		private handler: RecordHandler,
		private recordLength: number
	)
	{
		this.el = el( `button`, `Enable input device` )

		this.recordBtnEvent = this.recordBtnEvent.bind( this )

		this.recordBtnDown = this.recordBtnDown.bind( this )

		this.recordBtnUp = this.recordBtnUp.bind( this )

		this.stopRecording = this.stopRecording.bind( this )

		this.setError = this.setError.bind( this )

		this.setRecordingReady = this.setRecordingReady.bind( this )

		this.el.addEventListener( `click`, this.recordBtnEvent )

		this.state = RecordingState.noDevice

		this.mediaTracks = []

		this.recordingTimeout = 0
	}

	private reset()
	{
		this.error = undefined

		this.state = RecordingState.noDevice

		this.el.removeEventListener( `mousedown`, this.recordBtnDown )

		this.el.removeEventListener( `touchstart`, this.recordBtnDown )

		this.el.removeEventListener( `mouseup`, this.recordBtnUp )

		this.el.removeEventListener( `mouseleave`, this.recordBtnUp )

		this.el.removeEventListener( `touchend`, this.recordBtnUp )

		this.handler.reloadContext()
	}

	private setError( error: Error )
	{
		this.state = RecordingState.error

		this.error = error

		this.enable( `Reload context` )

		this.mediaTracks.forEach( track => track.stop() )

		this.mediaTracks.length = 0

		this.handler.onError()
	}

	private setRecordingReady()
	{
		this.state = RecordingState.idle

		this.enable( `Hold down to record` )
	}

	private requestDevice()
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

				return this.handler.handleStream( stream )
			} )
			.then( this.setRecordingReady )
			.catch( this.setError )
	}

	private disable( text: string )
	{
		this.el.textContent = text

		this.el.disabled = true
	}

	private enable( text: string )
	{
		this.el.textContent = text

		this.el.disabled = false
	}

	private stopRecording()
	{
		clearTimeout( this.recordingTimeout )

		if ( this.state !== RecordingState.recording ) return

		this.state = RecordingState.closing

		this.disable( `Stopping...` )

		this.handler.stopRecording()
			.then( this.setRecordingReady )
			.catch( this.setError )
	}

	private recordBtnDown( event: Event )
	{
		event.preventDefault()

		event.stopPropagation()

		if ( this.state === RecordingState.idle )
		{
			this.state = RecordingState.starting

			this.disable( `Starting...` )

			this.handler.startRecording()
				.then( () =>
				{
					this.enable( `Release to stop recording` )

					this.state = RecordingState.recording

					this.recordingTimeout = window.setTimeout( 
						this.stopRecording,
						this.recordLength * 1000 )
				} )
				.catch( this.setError )
		}
	}

	private recordBtnUp( event: Event )
	{
		event.preventDefault()

		event.stopPropagation()

		this.stopRecording()
	}

	private recordBtnEvent()
	{
		switch( this.state )
		{
			case RecordingState.noDevice:

				this.state = RecordingState.requestingDevice

				this.disable( `Loading...` )

				this.requestDevice()

				this.el.addEventListener( `mousedown`, this.recordBtnDown )

				this.el.addEventListener( `touchstart`, this.recordBtnDown )

				this.el.addEventListener( `mouseup`, this.recordBtnUp )

				this.el.addEventListener( `mouseleave`, this.recordBtnUp )

				this.el.addEventListener( `touchend`, this.recordBtnUp )

				break

			case RecordingState.error:

				this.reset()

				break
		}
	}

	public getError(): Error | undefined
	{
		return this.error
	}
}
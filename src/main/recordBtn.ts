import type { Entity } from "./entity"
import type { RedomComponent } from "redom"
import { RecordingEntity, RecordingState } from "./recordingEntity"
import { ButtonInteractionHandler, UIButton } from "./uiButton"

export interface RecordButtonHandler
{
	recordButtonOnStart: () => void

	recordButtonOnStop: () => void

	recordButtonOnReload: () => void

	recordButtonOnRequest: () => void
}

enum ButtonState
{
	error = `Reload context`,
	noDevice = `Enable input device`,
	requestingDevice = `Loading...`,
	idle = `Hold down to record`,
	stopRecording = `Stopping...`,
	recording = `Release to stop recording`,
	startRecording = `Starting...`
}

export class RecordBtn implements RedomComponent, RecordingEntity, ButtonInteractionHandler, Entity
{
	public el: UIButton

	public isRecordingEntity: true

	private recordingTimeout: number

	constructor(
		public id: string,
		private handler: RecordButtonHandler,
		private recordLength: number
	)
	{
		this.el = new UIButton(
			this,
			Object.values( ButtonState ).reduce( ( obj, val ) => Object.assign( obj, { [ val ]: val } ), {} ),
			ButtonState.noDevice
		)

		this.isRecordingEntity = true

		this.stopRecording = this.stopRecording.bind( this )

		this.onDown = this.onDown.bind( this )

		this.onUp = this.onUp.bind( this )

		this.onLeave = this.onLeave.bind( this )

		this.onClick = this.onClick.bind( this )

		this.recordingTimeout = 0
	}

	private stopRecording()
	{
		clearTimeout( this.recordingTimeout )

		this.handler.recordButtonOnStop()
	}

	public onDown( state: string ): void
	{
		if ( state !== ButtonState.idle ) return

		this.handler.recordButtonOnStart()
	}

	public onUp( state: string ): void
	{
		if ( state !== ButtonState.recording ) return

		this.stopRecording()
	}

	public onLeave( state: string ): void
	{
		if ( state !== ButtonState.recording ) return

		this.stopRecording()
	}

	public onClick( state: string ): void
	{
		switch ( state )
		{
			case ButtonState.error:

				this.handler.recordButtonOnReload()

				break

			case ButtonState.noDevice:
				
				this.handler.recordButtonOnRequest()

				break

			default:
				// do nothing
				break
		}
	}

	public onRecordingStateChanged( state: RecordingState ): void
	{
		switch( state )
		{
			case RecordingState.starting:

				this.el.disable()

				this.el.setState( ButtonState.startRecording )

				break

			case RecordingState.recording:

				this.el.setState( ButtonState.recording )

				this.el.enable()

				this.recordingTimeout = window.setTimeout( 
					this.stopRecording,
					this.recordLength * 1000 )

				break

			case RecordingState.closing:

				this.el.disable()

				this.el.setState( ButtonState.stopRecording )
		
				break

			case RecordingState.idle:

				this.el.setState( ButtonState.idle )

				this.el.enable()
		
				break

			case RecordingState.noDevice:

				this.el.setState( ButtonState.noDevice )

				break

			case RecordingState.error:
				
				this.el.setState( ButtonState.error )

				break

			case RecordingState.requestingDevice:

				this.el.disable()

				this.el.setState( ButtonState.requestingDevice )

				break
		}
	}

	public onRecordingError(): void
	{
		this.el.setState( ButtonState.error )
	}
}
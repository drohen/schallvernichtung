import type { RedomComponent } from "redom"
import { SampleState } from "./sampleEntity"
import { ButtonCTA, ButtonInteractionHandler, UIButton } from "./uiButton"

export interface UISamplePlayBtnHandler
{
	onToggleSamplePlaying: ( sampleID: string ) => void
}

enum ButtonState
{
	paused = `Play sample`,
	playing = `Pause sample`
}

export class UISamplePlayBtn implements RedomComponent, ButtonInteractionHandler
{
	public el: UIButton

	constructor(
		private sampleID: string,
		private handler: UISamplePlayBtnHandler
	)
	{
		this.el = new UIButton(
			this,
			Object.values( ButtonState ).reduce( ( obj, val ) => Object.assign( obj, { [ val ]: val } ), {} ),
			ButtonCTA.tap,
			ButtonState.paused
		)

		this.onClick = this.onClick.bind( this )
	}

	public onClick(): void
	{
		this.handler.onToggleSamplePlaying( this.sampleID )
	}

	public onStateChange( state: SampleState ): void
	{
		switch( state )
		{
			case SampleState.paused:

				this.el.setState( ButtonState.paused )

				break

			case SampleState.playing:

				this.el.setState( ButtonState.playing )

				break
		}
	}
}
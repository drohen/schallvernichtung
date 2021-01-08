import { el, RedomComponent } from "redom"

enum PlayBtnState
{
	playing,
	paused
}

export interface PlayHandler
{
	onPlay: () => Promise<void>

	onPause: () => Promise<void>
}

export class PlayBtn implements RedomComponent
{
	public el: HTMLButtonElement

	private state: PlayBtnState

	constructor(
		private handler: PlayHandler
	)
	{
		this.el = el( `button`, `Play audio` )

		this.state = PlayBtnState.paused

		this.playBtnEvent = this.playBtnEvent.bind( this )

		this.el.addEventListener( `click`, this.playBtnEvent )
	}

	private playBtnEvent()
	{
		switch( this.state )
		{
			case PlayBtnState.paused:

				this.state = PlayBtnState.playing

				this.el.textContent = `Pause audio`

				this.handler.onPlay()

				break

			case PlayBtnState.playing:

				this.pause()

				break
		}
	}

	public pause(): void
	{
		if ( this.state === PlayBtnState.paused ) return

		this.state = PlayBtnState.paused

		this.el.textContent = `Play audio`

		this.handler.onPause()
	}
}
import { el, mount, RedomComponent } from "redom"
import { CompressorControl } from "./compressorCtrl"
import { DistortionControl } from "./distortionCtrl"
import { LowpassControl } from "./lowpassCtrl"
import { PlayBtn, PlayHandler } from "./playBtn"
import { SpeedControl } from "./speedCtrl"
import { VolumeControl } from "./volumeCtrl"

interface SampleCoreProvider
{
	context: AudioContext

	onPlaySample: ( index: number ) => void

	onPauseSample: ( index: number ) => void
}

enum Visibility
{
	visible,
	hidden
}

export class SampleUI implements RedomComponent, PlayHandler
{
	public el: HTMLElement

	private playBtn: PlayBtn

	private distortionCtrl: DistortionControl

	private compressorCtrl: CompressorControl

	private volumeCtrl: VolumeControl

	private lowpassCtrl: LowpassControl

	private speedCtrl: SpeedControl

	private state: Visibility

	constructor(
		private core: SampleCoreProvider,
		private bufferNode: AudioBufferSourceNode,
		private nodeIndex: number
	)
	{
		this.el = el( `div.hidden` )

		this.playBtn = new PlayBtn( this )

		this.volumeCtrl = new VolumeControl( this.core )

		this.volumeCtrl.connectOutput( this.core.context.destination )

		this.lowpassCtrl = new LowpassControl( this.core )

		this.lowpassCtrl.connectOutput( this.volumeCtrl )

		this.distortionCtrl = new DistortionControl( this.core )

		this.distortionCtrl.connectOutput( this.lowpassCtrl )

		this.compressorCtrl = new CompressorControl( this.core )

		this.compressorCtrl.connectOutput( this.distortionCtrl )

		this.speedCtrl = new SpeedControl( this.core, this.bufferNode )

		mount( this.el, this.wrap( this.playBtn ) )

		mount( this.el, this.wrap( this.compressorCtrl, `Slide to control compressor` ) )

		mount( this.el, this.wrap( this.distortionCtrl, `Slide to control distortion` ) )

		mount( this.el, this.wrap( this.lowpassCtrl, `Slide to control filter` ) )

		mount( this.el, this.wrap( this.volumeCtrl, `Slide to control volume` ) )

		mount( this.el, this.wrap( this.speedCtrl, `Slide to control speed` ) )

		this.state = Visibility.hidden
	}

	private wrap( inner: RedomComponent, label?: string )
	{
		const div = el( `div` )

		if ( label )
		{
			const text = el( `p`, label )
	
			mount( div, text )
		}

		mount( div, inner )

		return div
	}

	public show(): void
	{
		if ( this.state === Visibility.visible ) return

		this.state = Visibility.visible

		this.el.classList.remove( `hidden` )
	}

	public hide(): void
	{
		if ( this.state === Visibility.hidden ) return

		this.state = Visibility.hidden

		this.el.classList.add( `hidden` )
	}

	public async onPlay(): Promise<void>
	{
		this.compressorCtrl.connectInput( this.bufferNode )

		this.core.onPlaySample( this.nodeIndex )
	}
	
	public async onPause(): Promise<void>
	{
		this.compressorCtrl.disconnectInput( this.bufferNode )

		this.core.onPauseSample( this.nodeIndex )
	}
}
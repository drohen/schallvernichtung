import { el, mount, RedomComponent } from "redom"
import { UISamplePlayBtn, UISamplePlayBtnHandler } from "./uiSamplePlayBtn"
import { UIRange, UIRangeNodeHandler } from "./uiRangeNode"
import { SampleEntity, SampleState, SampleUINodeID } from "./sampleEntity"

enum Visibility
{
	visible,
	hidden
}

type SampleRange = UIRange<SampleUINodeID>

export interface UISampleHandler extends UISamplePlayBtnHandler
{
	onSampleControlChange: ( sampleID: string, controlID: SampleUINodeID, value: number ) => void
}

export interface UISampleCoreProvider
{
	getPositionForLogRangeValue: ( value: number, min: number, max: number ) => number
}

export class UISample implements RedomComponent, UIRangeNodeHandler<SampleUINodeID>, SampleEntity
{
	public el: HTMLElement

	public isSampleEntity: true

	private playBtn: UISamplePlayBtn

	private volumeCtrl: SampleRange

	private lowpassCtrl: SampleRange

	private distortionCtrl: SampleRange

	private compressorCtrl: SampleRange

	private speedCtrl: SampleRange

	private state: Visibility

	constructor(
		public id: string,
		private sampleID: string,
		private handler: UISampleHandler,
		core: UISampleCoreProvider
	)
	{
		this.el = el( `div.hidden` )

		this.isSampleEntity = true

		this.playBtn = new UISamplePlayBtn( sampleID, this.handler )

		this.volumeCtrl = new UIRange<SampleUINodeID>( SampleUINodeID.volume, this, `mid` )

		this.lowpassCtrl = new UIRange<SampleUINodeID>( SampleUINodeID.lowpass, this )

		this.distortionCtrl = new UIRange<SampleUINodeID>( SampleUINodeID.distortion, this )

		this.compressorCtrl = new UIRange<SampleUINodeID>( SampleUINodeID.compressor, this )

		this.speedCtrl = new UIRange<SampleUINodeID>( SampleUINodeID.speed, this, core.getPositionForLogRangeValue( 1, 0.1, 3 ) )

		/**
		 * Speed control
		 */

		// this.speedCtrl.el.value = `${this.logRange( 1, 0.1, 3, true )}`

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

	public onUIRangeChange( rangeID: SampleUINodeID, value: number ): void
	{
		this.handler.onSampleControlChange( this.sampleID, rangeID, value )
	}

	public onSampleStateChanged( sampleID: string, state: SampleState ): void
	{
		if ( sampleID !== this.sampleID ) return

		this.playBtn.onStateChange( state )
	}

	public onSampleNodeValueChange( sampleID: string, nodeID: string, value: number ): void
	{
		if ( sampleID !== this.id ) return

		switch( nodeID )
		{
			case SampleUINodeID.compressor:

				this.compressorCtrl.setValue( value )

				break
	
			case SampleUINodeID.distortion:

				this.distortionCtrl.setValue( value )

				break
	
			case SampleUINodeID.lowpass:

				this.lowpassCtrl.setValue( value )

				break
	
			case SampleUINodeID.speed:

				this.speedCtrl.setValue( value )

				break
	
			case SampleUINodeID.volume:

				this.volumeCtrl.setValue( value )

				break
		}
	}

	public onSampleSelectedChanged( sampleID: string ): void
	{
		if ( this.state === Visibility.visible && this.sampleID !== sampleID )
		{
			this.hide()
		}

		if ( this.state === Visibility.hidden && this.sampleID === sampleID )
		{
			this.show()
		}
	}

	public onSampleError( error: Error ): void
	{
		// TODO: show error message
	}

	public onSampleCreated(): void
	{
		// do nothing
	}
}
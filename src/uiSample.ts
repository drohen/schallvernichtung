import { el, mount, RedomComponent } from "redom"
import { UISamplePlayBtn, UISamplePlayBtnHandler } from "./uiSamplePlayBtn"
import { UIRange, UIRangeImageProvider, UIRangeNodeHandler } from "./uiRangeNode"
import { SampleEntity, SampleState, SampleUINodeID } from "./sampleEntity"
import type { Entity } from "./entity"

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
	addEntity: ( entity: Entity ) => void
	createID: () => string
}

export interface UISampleMathProvider
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
		core: UISampleCoreProvider,
		math: UISampleMathProvider,
		img: UIRangeImageProvider
	)
	{
		this.el = el( `div.hidden` )

		this.isSampleEntity = true

		this.playBtn = new UISamplePlayBtn( sampleID, this.handler )

		this.volumeCtrl = new UIRange<SampleUINodeID>( core.createID(), SampleUINodeID.volume, this, img, `Slide to control volume`, 500001 )

		core.addEntity( this.volumeCtrl )

		this.lowpassCtrl = new UIRange<SampleUINodeID>( core.createID(), SampleUINodeID.lowpass, this, img, `Slide to control filter` )

		core.addEntity( this.lowpassCtrl )

		this.distortionCtrl = new UIRange<SampleUINodeID>( core.createID(), SampleUINodeID.distortion, this, img, `Slide to control distortion` )

		core.addEntity( this.distortionCtrl )

		this.compressorCtrl = new UIRange<SampleUINodeID>( core.createID(), SampleUINodeID.compressor, this, img, `Slide to control compressor` )

		core.addEntity( this.compressorCtrl )

		this.speedCtrl = new UIRange<SampleUINodeID>( 
			core.createID(),
			SampleUINodeID.speed, 
			this,
			img,
			`Slide to control speed`, 
			math.getPositionForLogRangeValue( 1, 0.1, 3 ) )

		core.addEntity( this.speedCtrl )

		/**
		 * Speed control
		 */

		mount( this.el, this.playBtn ) 

		mount( this.el, this.compressorCtrl ) 

		mount( this.el, this.distortionCtrl ) 

		mount( this.el, this.lowpassCtrl ) 

		mount( this.el, this.volumeCtrl ) 

		mount( this.el, this.speedCtrl ) 

		this.state = Visibility.hidden
	}

	public show(): void
	{
		if ( this.state === Visibility.visible ) return

		this.state = Visibility.visible

		this.el.classList.remove( `hidden` )

		this.compressorCtrl.onResize()

		this.distortionCtrl.onResize()

		this.lowpassCtrl.onResize()

		this.speedCtrl.onResize()
		
		this.volumeCtrl.onResize()
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
		if ( sampleID !== this.sampleID ) return

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

	public loadHand(): void
	{
		this.compressorCtrl.update()

		this.distortionCtrl.update()

		this.lowpassCtrl.update()

		this.speedCtrl.update()
		
		this.volumeCtrl.update()
	}
}
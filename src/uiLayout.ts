import { el, mount, RedomComponent, setChildren } from "redom"
import type { SampleEntity, SampleState } from "./sampleEntity"
import { UISampleSelect } from "./uiSampleSelect"
import { UISample, UISampleCoreProvider } from "./uiSample"
import { UIRecordBtn } from "./uiRecordBtn"
import type { SampleHandler } from "./sampleHandler"
import type { RecordingHandler } from "./recordingHandler"
import type { MathUtility } from "./mathUtility"
import type { Entity } from "./entity"

export interface UILayoutHandler extends UISampleCoreProvider
{
	createID: () => string

	addEntity: ( entity: Entity ) => void
}

export class UILayout implements SampleEntity
{
	public isSampleEntity: true

	private baseEl: HTMLElement

	private sampleBlocks: UISample[]

	private samplesMount: HTMLElement

	private sampleList: UISampleSelect

	private recordBtn: UIRecordBtn

	constructor(
		public id: string,
		private handler: UILayoutHandler,
		private sampleHandler: SampleHandler,
		private mathUtility: MathUtility,
		mountSelector: string,
		recordingHandler: RecordingHandler,
		recordLength: number,
		cssPath: string
	)
	{
		const root = this.getElOrThrow( mountSelector )

		this.addStylesheet( cssPath )

		const outer = el( `div.schallvernichtung` )

		this.baseEl = el( `div.base` )

		mount( root, outer )

		mount( outer, this.baseEl )

		this.sampleBlocks = []

		this.samplesMount = el( `div.samplesMount` )

		this.sampleList = new UISampleSelect( this.handler.createID(), sampleHandler )

		this.handler.addEntity( this.sampleList )

		this.recordBtn = new UIRecordBtn( this.handler.createID(), recordingHandler, recordLength )

		this.handler.addEntity( this.recordBtn )

		this.isSampleEntity = true

		this.setUI()
	}

	private addStylesheet( path: string )
	{
		const head = this.getElOrThrow( `head` )

		const link = el( `link`, { type: `text/css`, rel: `stylesheet`, href: path } )

		head.appendChild( link )
	}

	private getElOrThrow<T extends HTMLElement>( selector: string ): T
	{
		const el = document.querySelector<T>( selector )

		if ( !el )
		{
			throw Error( `Couldn't find element ${selector}` )
		}

		return el
	}

	private wrap( inner: RedomComponent | HTMLElement | ( RedomComponent | HTMLElement )[], label?: string, className?: string )
	{
		const div = el( `div${className ? `.${className}` : ``}` )

		if ( label )
		{
			const text = el( `p`, label )
	
			mount( div, text )
		}

		if ( Array.isArray( inner ) )
		{
			setChildren( div, inner )
		}
		else
		{
			mount( div, inner )
		}

		return div
	}

	private setUI()
	{
		mount( this.baseEl, this.wrap( [ this.recordBtn ], undefined, `topLevel` ) )

		mount( this.baseEl, this.wrap( [ this.samplesMount, this.sampleList ], undefined, `sampleManager` ) )
	}

	public onSampleCreated( sampleID: string, label: string ): void
	{
		const block = new UISample( 
			this.handler.createID(), 
			sampleID, 
			this.sampleHandler,
			label,
			this.handler, 
			this.mathUtility )

		this.handler.addEntity( block )

		this.sampleBlocks.push( block )

		mount( this.samplesMount, block )
	}

	public onSampleStateChanged( sampleID: string, state: SampleState, previous: SampleState ): void
	{
		// mute/unmute all button
	}

	public onSampleSelectedChanged( sampleID: string ): void
	{
		this.baseEl.scrollTo( 0, 0 )
	}

	public onSampleNodeValueChange(): void
	{
		// do nothing
	}

	public onSampleError( error: Error ): void
	{
		// handle error
	}
}
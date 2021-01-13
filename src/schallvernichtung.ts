import type { Entity } from "./entity"
import { el, mount, RedomComponent, setChildren } from "redom"
import { UIRecordBtn } from "./uiRecordBtn"
import { RecordingHandler, RecordingSystemCoreProvider } from "./recordingHandler"
import { UISampleSelect } from "./uiSampleSelect"
import { UISample } from "./uiSample"
import { nanoid } from "nanoid"
import { SampleHandler, SampleSystemCoreProvider } from "./sampleHandler"
import { SampleNode } from "./sampleNode"
import { ContextNode } from "./contextNode"
import { MathUtility } from "./mathUtility"

export class Schallvernichtung 
implements
	RecordingSystemCoreProvider,
	SampleSystemCoreProvider
{
	private baseEl: HTMLElement

	private contextNodeID: string

	private contextNode: ContextNode

	private recordBtn: UIRecordBtn

	private recordingHandler: RecordingHandler

	private sampleHandler: SampleHandler

	private sampleBlocks: UISample[]

	private samplesMount: HTMLElement

	private sampleList: UISampleSelect
	
	private _entities: Entity[]

	private mathUtility: MathUtility

	constructor( mountSelector: string, workerPath: string )
	{
		this.baseEl = this.getElOrThrow( mountSelector )

		const recordLength = 10

		const chunkSize = 4096

		this.contextNodeID = `context`

		this.contextNode = new ContextNode( this.contextNodeID )

		this._entities = []

		this.recordingHandler = new RecordingHandler( this, this.contextNode, workerPath, chunkSize, recordLength )

		this.recordBtn = new UIRecordBtn( this.createID(), this.recordingHandler, recordLength )

		this.addEntity( this.recordBtn )

		this.sampleHandler = new SampleHandler( this )

		this.sampleBlocks = []

		this.samplesMount = el( `div.samplesMount` )

		this.sampleList = new UISampleSelect( this.createID(), this.sampleHandler )

		this.addEntity( this.sampleList )

		this.mathUtility = new MathUtility()

		this.setUI()
	}

	private addEntity( entity: Entity )
	{
		this._entities.push( entity )
	}

	private createID()
	{
		return nanoid( 10 )
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

	public entities(): Entity[]
	{
		return this._entities
	}

	public onRecorded( data: Float32Array ): void
	{
		if ( data.length < this.contextNode.context().sampleRate * 0.2 ) return

		const nodeID = this.createID()

		const node = new SampleNode( nodeID, this.contextNode, this.mathUtility, data )

		this.addEntity( node )

		node.audioNodeManager.connectOutput( this.contextNode )

		const block = new UISample( this.createID(), nodeID, this.sampleHandler, this.mathUtility )

		this.addEntity( block )

		this.sampleBlocks.push( block )

		mount( this.samplesMount, block )

		this.sampleHandler.onSampleCreated( nodeID )
	}
}

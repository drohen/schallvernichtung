import type { Entity } from "./entity"
import { RecordingHandler, RecordingSystemCoreProvider } from "./recordingHandler"
import { nanoid } from "nanoid"
import { SampleHandler, SampleSystemCoreProvider } from "./sampleHandler"
import { SampleNode } from "./sampleNode"
import { ContextNode } from "./contextNode"
import { MathUtility } from "./mathUtility"
import { UILayout, UILayoutHandler } from "./uiLayout"

export class Schallvernichtung 
implements
	RecordingSystemCoreProvider,
	SampleSystemCoreProvider,
	UILayoutHandler
{
	private contextNodeID: string

	private contextNode: ContextNode

	private recordingHandler: RecordingHandler

	private sampleHandler: SampleHandler
	
	private _entities: Entity[]

	private mathUtility: MathUtility

	private ui: UILayout

	constructor( mountSelector: string, workerPath: string, cssPath: string )
	{
		const recordLength = 10

		const chunkSize = 4096

		this.contextNodeID = `context`

		this.contextNode = new ContextNode( this.contextNodeID )

		this._entities = []

		this.recordingHandler = new RecordingHandler( this, this.contextNode, workerPath, chunkSize, recordLength )

		this.sampleHandler = new SampleHandler( this )

		this.mathUtility = new MathUtility()

		this.ui = new UILayout( 
			this.createID(), 
			this, 
			this.sampleHandler, 
			this.mathUtility, 
			mountSelector, 
			this.recordingHandler, 
			recordLength,
			cssPath )

		this.addEntity( this.ui )
	}

	public addEntity( entity: Entity ): void
	{
		this._entities.push( entity )
	}

	public createID(): string
	{
		return nanoid( 10 )
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

		this.sampleHandler.onSampleCreated( nodeID )
	}
}

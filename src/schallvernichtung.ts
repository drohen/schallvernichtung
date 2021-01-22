import type { Entity } from "./entity"
import { RecordingHandler, RecordingSystemCoreProvider } from "./recordingHandler"
import { nanoid } from "nanoid"
import { SampleHandler, SampleSystemCoreProvider } from "./sampleHandler"
import { ContextNode } from "./contextNode"
import { MathUtility } from "./mathUtility"
import { UILayout, UILayoutHandler } from "./uiLayout"
import { Cache, CacheHandler } from "./cache"
import type { Sample } from "./sampleEntity"
import { SampleNode } from "./sampleNode"

export class Schallvernichtung
implements
	SampleSystemCoreProvider,
	UILayoutHandler,
	RecordingSystemCoreProvider,
	CacheHandler
{
	public onCacheLoaded: () => void

	private contextNodeID: string

	private contextNode: ContextNode

	private recordingHandler: RecordingHandler

	private sampleHandler: SampleHandler
	
	private _entities: Entity[]

	private mathUtility: MathUtility

	private ui: UILayout

	private cache: Cache

	constructor( mountSelector: string, workerPath: string, cssPath: string )
	{
		const recordLength = 10

		const chunkSize = 4096

		this.contextNodeID = `context`

		this.contextNode = new ContextNode( this.contextNodeID )

		this._entities = []

		this.mathUtility = new MathUtility()

		this.cache = new Cache( this.createID(), this, this.mathUtility )

		this.addEntity( this.cache )

		this.recordingHandler = new RecordingHandler( this, this.contextNode, workerPath, chunkSize, recordLength, this.cache )

		this.sampleHandler = new SampleHandler( this )

		this.ui = new UILayout( 
			this.createID(), 
			this, 
			this.sampleHandler,
			mountSelector, 
			this.recordingHandler, 
			recordLength,
			cssPath )

		this.addEntity( this.ui )

		this.onCacheLoaded = this.recordingHandler.appReady
	}

	public emitSample( sample: Sample ): void
	{
		const node = new SampleNode( this.contextNode, this.mathUtility, sample )

		this.addEntity( node )

		node.audioNodeManager.connectOutput( this.contextNode )

		this.sampleHandler.onSampleCreated( sample )
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
}

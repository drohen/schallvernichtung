export interface AudioNodeManagerContext
{
	isAudioNodeManaged: true

	audioNodeManager: AudioNodeManager
}

export class AudioNodeManager
{
	private inputConnections: {[nodeID: string]: AudioNodeManagerContext}

	private outputConnections: {[nodeID: string]: AudioNodeManagerContext}

	constructor(
		private id: string,
		private inputNode?: AudioNode,
		private outputNode?: AudioNode
	)
	{
		this.inputConnections = {}

		this.outputConnections = {}
	}

	private isManaged( context: unknown ): context is AudioNodeManagerContext
	{
		return `isAudioNodeManaged` in ( context as AudioNodeManagerContext ) 
			&& ( context as AudioNodeManagerContext ).isAudioNodeManaged
			&& ( context as AudioNodeManagerContext ).audioNodeManager !== undefined
	}

	public nodeID(): string
	{
		return this.id
	}

	public setInput( node: AudioNode ): void
	{
		if ( this.inputNode )
		{
			throw Error( `Input node already set for ${this.id}` )
		}

		this.inputNode = node 
	}

	public setOutput( node: AudioNode ): void
	{
		if ( this.outputNode )
		{
			throw Error( `Output node already set for ${this.id}` )
		}

		this.outputNode = node 
	}

	public input(): AudioNode
	{
		if ( !this.inputNode )
		{
			throw Error( `No input node set for ${this.id}` )
		}

		return this.inputNode
	}

	public output(): AudioNode
	{
		if ( !this.outputNode )
		{
			throw Error( `No output node set for ${this.id}` )
		}

		return this.outputNode
	}

	public connectInput( node: AudioNode | AudioNodeManagerContext ): void
	{
		if ( this.isManaged( node ) )
		{
			if ( this.inputConnections[ node.audioNodeManager.nodeID() ] ) return

			node.audioNodeManager.output().connect( this.input() )

			this.inputConnections[ node.audioNodeManager.nodeID() ] = node
		}
		else
		{
			node.connect( this.input() )
		}
	}

	public disconnectInput( node: AudioNode | AudioNodeManagerContext ): void
	{
		if ( this.isManaged( node ) )
		{
			if ( this.inputConnections[ node.audioNodeManager.nodeID() ] )
			{
				return this.disconnectInputByID( node.audioNodeManager.nodeID() )
			}

			node.audioNodeManager.output().disconnect( this.input() )
		}
		else
		{
			node.disconnect( this.input() )
		}
	}

	public disconnectInputByID( id: string ): void
	{
		if ( this.inputConnections[ id ] )
		{
			const node = this.inputConnections[ id ]

			delete this.inputConnections[ id ]

			this.disconnectInput( node )
		}
	}

	public connectOutput( node: AudioNode | AudioNodeManagerContext ): void
	{
		if ( this.isManaged( node ) )
		{
			if ( this.outputConnections[ node.audioNodeManager.nodeID() ] ) return

			this.output().connect( node.audioNodeManager.input() )

			this.outputConnections[ node.audioNodeManager.nodeID() ] = node
		}
		else
		{
			this.output().connect( node )
		}
	}

	public disconnectOutput( node: AudioNode | AudioNodeManagerContext ): void
	{
		if ( this.isManaged( node ) )
		{
			if ( this.outputConnections[ node.audioNodeManager.nodeID() ] )
			{
				return this.disconnectOutputByID( node.audioNodeManager.nodeID() )
			}

			this.output().disconnect( node.audioNodeManager.input() )
		}
		else
		{
			this.output().disconnect( node )
		}
	}

	public disconnectOutputByID( id: string ): void
	{
		if ( this.outputConnections[ id ] )
		{
			const node = this.outputConnections[ id ]

			delete this.outputConnections[ id ]

			this.disconnectOutput( node )
		}
	}
}
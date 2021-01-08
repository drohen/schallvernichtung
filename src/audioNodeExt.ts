export class AudioNodeExtension
{
	public isExt: true

	constructor(
		protected id: string,
		private inputNode?: AudioNode,
		private outputNode?: AudioNode
	)
	{
		this.isExt = true
	}

	private isExtension( node: AudioNode | AudioNodeExtension ): node is AudioNodeExtension
	{
		return `isExt` in node && node.isExt
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

	public connectInput( node: AudioNode | AudioNodeExtension ): void
	{
		if ( this.isExtension( node ) )
		{
			node.output().connect( this.input() )
		}
		else
		{
			node.connect( this.input() )
		}
	}

	public disconnectInput( node: AudioNode | AudioNodeExtension ): void
	{
		if ( this.isExtension( node ) )
		{
			node.output().disconnect( this.input() )
		}
		else
		{
			node.disconnect( this.input() )
		}
	}

	public connectOutput( node: AudioNode | AudioNodeExtension ): void
	{
		if ( this.isExtension( node ) )
		{
			this.output().connect( node.input() )
		}
		else
		{
			this.output().connect( node )
		}
	}

	public disconnectOutput( node: AudioNode | AudioNodeExtension ): void
	{
		if ( this.isExtension( node ) )
		{
			this.output().disconnect( node.input() )
		}
		else
		{
			this.output().disconnect( node )
		}
	}
}
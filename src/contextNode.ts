import { AudioNodeManager, AudioNodeManagerContext } from "./audioNodeExt"
import type { AudioContextProvider } from "./recordingHandler"
import type { SampleNodeAudioProvider } from "./sampleNode"

export class ContextNode 
implements 
	AudioNodeManagerContext,
	AudioContextProvider,
	SampleNodeAudioProvider
{
	public isAudioNodeManaged: true

	public audioNodeManager: AudioNodeManager

	private _context: AudioContext

	private sourceNode?: MediaStreamAudioSourceNode

	constructor(
		nodeID: string
	)
	{
		const _AudioContext: typeof AudioContext = window.AudioContext || window.webkitAudioContext
	
		this._context = new _AudioContext()
		
		this._context.suspend()

		this.isAudioNodeManaged = true

		this.audioNodeManager = new AudioNodeManager( nodeID )

		this.audioNodeManager.setInput( this._context.destination )
	}

	public context(): AudioContext
	{
		return this._context
	}

	public onError(): void
	{
		this._context.suspend()
	}

	public async reloadContext(): Promise<void>
	{
		this._context.resume()
	}

	public async handleStream( stream: MediaStream ): Promise<void>
	{
		this._context.resume()

		this.sourceNode = this._context.createMediaStreamSource( stream )

		this.audioNodeManager.setOutput( this.sourceNode )
	}

	public getRecorderNode(): AudioNodeManagerContext
	{
		return this
	}
}
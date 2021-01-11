import type { Entity } from "./entity"
import { el, mount, RedomComponent, setChildren } from "redom"
import { RecordBtn } from "./recordBtn"
import { RecordingHandler, RecordingSystemCoreProvider } from "./recordingHandler"
import { SampleBank, SampleCoreProvider } from "./sampleBank"
import { SampleSelect, SampleSelectHandler } from "./sampleSelect"
import { SampleUI } from "./sampleUI"

export class Schallvernichtung 
implements
	SampleCoreProvider,
	SampleSelectHandler,
	RecordingSystemCoreProvider
{
	private baseEl: HTMLElement

	public context: AudioContext

	private recordBtn: RecordBtn

	private sourceNode?: MediaStreamAudioSourceNode

	private recordingHandler: RecordingHandler

	private sampleBlocks: SampleUI[]

	private sampleBank: SampleBank

	private samplesMount: HTMLElement

	private sampleList: SampleSelect
	
	public entities: Entity[]

	public static init(): void
	{
		new Schallvernichtung()
	}

	constructor()
	{
		this.baseEl = this.getElOrThrow( `#root` )

		const _AudioContext: typeof AudioContext = window.AudioContext || window.webkitAudioContext
	
		this.context = new _AudioContext()
		
		this.context.suspend()

		const recordLength = 10

		const chunkSize = 4096

		this.entities = []

		this.recordingHandler = new RecordingHandler( this, `/_dist_/recordWorker.js`, chunkSize, recordLength )

		this.recordBtn = new RecordBtn( `${this.entities.length}`, this.recordingHandler, recordLength )

		this.entities.push( this.recordBtn )

		this.sampleBank = new SampleBank( this, 1 )

		this.sampleBlocks = []

		this.samplesMount = el( `div.samplesMount` )

		this.sampleList = new SampleSelect( this )

		this.setUI()
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
		mount( this.baseEl, this.wrap( [ this.wrap( this.recordBtn ), this.samplesMount ], undefined, `controls` ) )

		mount( this.baseEl, this.sampleList )
	}

	public onRecorded( data: Float32Array ): void
	{
		this.sampleBank.create( data )
	}

	public async handleStream( stream: MediaStream ): Promise<void>
	{
		this.context.resume()

		this.sourceNode = this.context.createMediaStreamSource( stream )
	}

	public onError(): void
	{
		this.context.suspend()

		// console.error( this.recordBtn.getError() )
	}

	public async startRecording(): Promise<void>
	{
		// this.sourceNode?.connect( this.processorNode )

		// this.processorNode.connect( this.context.destination )

		// this.recordBuff.record()
	}

	public async stopRecording(): Promise<void>
	{
		// this.recordBuff.stopRecord()

		// this.processorNode.disconnect( this.context.destination )

		// this.sourceNode?.disconnect( this.processorNode )
	}

	public async reloadContext(): Promise<void>
	{
		this.context.resume()
	}

	public async onPlaySample( index: number ): Promise<void>
	{
		this.sampleBank.play( index )
	}

	public async onPauseSample( index: number ): Promise<void>
	{
		this.sampleBank.pause( index )
	}

	public onSampleAdd( index: number ): void
	{
		const block = new SampleUI( this, this.sampleBank.node( index ), index )

		this.sampleBlocks.push( block )

		mount( this.samplesMount, block )

		this.sampleList.add( index, this.sampleBank.label( index ) )
	}

	public onLabelChange(): void
	{
		//
	}

	public onSampleSelected( index: number, previous?: number ): void
	{
		if ( previous !== undefined ) this.sampleBlocks[ previous ].hide()

		this.sampleBlocks[ index ].show()
	}

	public getRecorderInputNode(): AudioNode
	{
		if ( !this.sourceNode )
		{
			throw Error( `No source node available for recording` )
		}

		return this.sourceNode
	}
}

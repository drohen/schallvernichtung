interface Window {
	webkitAudioContext: typeof AudioContext
}

interface AudioWorkletProcessor 
{
	readonly port: MessagePort;
	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>
	): boolean;
}

// declare type AudioWorkletNodeOptions = any;

// declare type AudioParamDescriptor = any;

declare var AudioWorkletProcessor: {
	prototype: AudioWorkletProcessor;
	new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(
	name: string,
	processorCtor: (new (
		options?: AudioWorkletNodeOptions
	) => AudioWorkletProcessor) & {
		parameterDescriptors?: AudioParamDescriptor[];
	}
): undefined;

declare function postMessage(workerMessage: any, transfer?: Transferable[]): void

interface ExtendableEvent extends Event {
	waitUntil(fn: Promise<any>): void;
}

interface FetchEvent extends Event {
	request: Request;
	respondWith(response: Promise<Response>|Response): Promise<Response>;
}

interface InstallEvent extends ExtendableEvent {
	activeWorker: ServiceWorker
}

interface ActivateEvent extends ExtendableEvent {
}
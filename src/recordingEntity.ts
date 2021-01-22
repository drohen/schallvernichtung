import type { Entity } from "./entity"

export enum RecordingState
{
	noDevice,
	requestingDevice,
	streamInitiated,
	idle,
	starting,
	ready,
	recording,
	closing,
	error
}

export interface RecordingEntity extends Entity
{
	isRecordingEntity: true

	onRecordingStateChanged: ( state: RecordingState ) => void

	onRecordingError: ( error: Error ) => void
}

export interface RecordingWorkerCloseMessage
{
	command: `close`
}

export interface RecordingWorkerInitMessage
{
	command: `init`,
	data: {
		sampleRate: number,
		maxLength: number,
		chunkSize: number
	}
}

export interface RecordingWorkerStartMessage
{
	command: `start`
}

export interface RecordingWorkerStopMessage
{
	command: `stop`
}

export interface RecordingWorkerChunkMessage
{
	command: `chunk`
	buffer: Float32Array
}

export interface RecordingWorkerOutputReadyMessage
{
	message: `ready`
}

export interface RecordingWorkerOutputBufferMessage
{
	message: `done`,
	buffer: Float32Array
}

export interface RecordingWorkerOutputRecordingMessage
{
	message: `recording`
}
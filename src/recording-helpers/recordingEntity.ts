import type { RecordedBufferHandler } from "./recordBuff"
import type { Entity } from "./entity"

export enum RecordingState
{
	noDevice,
	requestingDevice,
	idle,
	starting,
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
		chunkSize: number,
		handler: RecordedBufferHandler
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
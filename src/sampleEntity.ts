import type { Entity } from "./entity"

export enum SampleState
{
	notStarted,
	playing,
	paused
}

export enum SampleUINodeID
{
	distortion = `distortion`,
	compressor = `compressor`,
	volume = `volume`,
	lowpass = `lowpass`,
	speed = `speed`
}

export interface SampleEntity extends Entity
{
	isSampleEntity: true

	onSampleCreated: ( sampleID: string, label: string ) => void

	onSampleStateChanged: ( sampleID: string, state: SampleState, previous: SampleState ) => void

	onSampleSelectedChanged: ( sampleID: string ) => void

	onSampleNodeValueChange: ( sampleID: string, nodeID: SampleUINodeID, value: number ) => void

	onSampleError: ( error: Error ) => void
}
import type { UIRangeImageProvider } from "./uiRangeNode"

export interface ImageHandler
{
	onMushImageLoaded: () => void

	onHandImageLoaded: () => void
}

export class ImageProvider implements UIRangeImageProvider
{
	private mush: string

	private hand: string

	private mushImgEl: HTMLImageElement

	private handImgEl: HTMLImageElement

	constructor(
		private handler: ImageHandler
	)
	{
		this.mush = `data:image/jpeg;base64,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`

		this.hand = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAQAAAACNCElAAACgklEQVRIx82WS0iUURTH/6MyzWhgZY6LYCIbFMVHYWUQBD0hbBFWC3tZA2ktSpMWBTUF0fTYBNKmoo2LkISihRBEC7OFpE3tXEQPKMceRpQlPXT+nXu/mXFmyuab75tF/8PAHO7lN+eee+45AySrAj2l9NIhhk6UwIbWYqScvXzJQd7gYuIZFlmHbQNbaOgBfQRRaR3WCDbzu4Z94UoFq7AF28WfGjaSDdgOTmjYa66zD9vHiIYNs8Y+bA9/aNgo67IR2ZSGfeDybMAmNewNl9mHtUfr7AWXZiMyI2fjXG0ftp8xbVSwGjgRwHltx5Ere5zazMFao6VBblCw9wg3sonb1XdiEG0Ia+tGE8rTwnZHnxMlRiereSfq9fE2PXRJUV9jlZiHOIPT6NO2fqjqT1jD9AUoVcvjmoh7n1nLVXEvyBwWcqF8VMybGAoy14Dkw6/tcjJsi2x7FfeeSzSf4t43HuReWR1jgHNkn+/cFTfgxgCeOlhpZCUJFpauNh73vvJuwtovXuDNaIFvlSjB+yGgAJzHW/JLV3mIeTzAREWYXlPsZIHABq5rmDe+0MsuZqpRnlWwSJkc04VHHoZoXffkYmRirIFDpb8QLLUB0w2hLVYQHkj6rUs3hKIYrARSL0P2IvPGYLPQCilQaxrjEnXI/OnKL4bwrWmzSn7SdC1Gv4t+C6jHRtdLma55ODqXJ2SWf8wI1qBQHZid+siL0IVIDo9kBNOtqfbvLagF7MgA9UQN6ofwzfTH5a2X3SZvMcj5xDvUzdwemzFZz34TsIA6YA/K/tVr3dLxedEsbGe6OXAYvGQCdkrB/Olg7f8z7CSPsT7BViR5hr/ALMy0pcB+A9RSdD00vbpEAAAAAElFTkSuQmCC`

		this.mushImgEl = new Image( 600, 600 )

		this.mushImgEl.onload = this.handler.onMushImageLoaded
		
		this.mushImgEl.src = this.mush

		this.handImgEl = new Image( 38, 38 )

		this.handImgEl.onload = this.handler.onHandImageLoaded
		
		this.handImgEl.src = this.hand
	}

	public mushImgStr(): string
	{
		return this.mush
	}

	public handImgStr(): string
	{
		return this.hand
	}

	public mushImg(): HTMLImageElement
	{
		return this.mushImgEl
	}

	public handImg(): HTMLImageElement
	{
		return this.handImgEl
	}
}
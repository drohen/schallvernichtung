class SchallvernichtungServiceWorker 
{
	public static cacheName = `schallvernichtung-v1`

	public static run(): void 
	{
		self.addEventListener( `install`, SchallvernichtungServiceWorker.onInstalled )

		self.addEventListener( `fetch`, SchallvernichtungServiceWorker.onFetched )
	}

	public static onInstalled = ( _event: Event ): void => 
	{
		const pathsSearch = new URL( window.location.href ).searchParams.get( `paths` )

		if ( !pathsSearch )
		{
			throw Error( `Null data passed to service worker` )
		}

		const paths = JSON.parse( pathsSearch )

		if ( !Array.isArray( paths ) )
		{
			throw Error( `Invalid data passed to service worker` )
		}
		
		const event = <InstallEvent>_event

		event.waitUntil(
			caches.open( SchallvernichtungServiceWorker.cacheName )
				.then( ( cache ) => 
					cache.addAll( paths ) )
		)
	}

	public static onFetched = ( _event: Event ): void => 
	{
		const event = <FetchEvent>_event
		
		event.respondWith(
			caches.match( event.request, { ignoreSearch: true } )
				.then( matchResponse =>  matchResponse || fetch( event.request ) )
				.then( fetchResponse => 
					caches.open( SchallvernichtungServiceWorker.cacheName )
						.then( cache => ( { cache, fetchResponse } ) ) )
				.then( ( { cache, fetchResponse } ) => 
				{
					cache.put( event.request, fetchResponse.clone() )

					return fetchResponse
				} )
		)
	}
}
    
SchallvernichtungServiceWorker.run()
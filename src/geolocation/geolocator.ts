export class GeoLocatorInput {
	constructor(
		readonly area: string,
		readonly subArea: string,
		readonly countryCode: string,
		readonly locality?: string,
		readonly streetNumber?: string,
		readonly postalCode?: string,
	) {}
}

export class GeoLocatorOutput {
	constructor(
		readonly latitude: number,
		readonly longitude: number,
	) {}
}

export const GeoLocatorProvider = 'GeoLocator';

export interface Geolocator {
	coordinates(input: GeoLocatorInput): Promise<GeoLocatorOutput>;
}

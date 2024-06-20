export class GeoLocatorInput 
{
    constructor(
        readonly area: string,
        readonly subArea: string,
        readonly locality: string,
        readonly countryCode: string
    ) 
    {}
}

export class GeoLocatorOutput 
{
    constructor(
        readonly latitude: number,
        readonly longitude: number
    ) 
    {}
}

export const GeoLocatorServiceProvider = 'GeoLocatorService';

export interface GeoLocatorService 
{
    getCoordinates(input: GeoLocatorInput): GeoLocatorOutput;
}
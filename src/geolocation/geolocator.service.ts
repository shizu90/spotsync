import { Injectable } from "@nestjs/common";
import { Geolocator, GeoLocatorInput, GeoLocatorOutput } from "./geolocator";

@Injectable()
export class GeoLocatorService implements Geolocator 
{
    constructor() 
    {}

    public async coordinates(input: GeoLocatorInput): Promise<GeoLocatorOutput> {
        return new GeoLocatorOutput(0, 0);
    }
}
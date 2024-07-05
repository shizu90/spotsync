import { Injectable } from "@nestjs/common";
import { GeoLocatorInput, GeoLocatorOutput, GeoLocatorService } from "src/user/application/ports/out/geo-locator.service";

@Injectable()
export class GeoLocatorServiceImpl implements GeoLocatorService 
{
    public getCoordinates(input: GeoLocatorInput): GeoLocatorOutput {
        return new GeoLocatorOutput(0.0, 0.0);
    }
}
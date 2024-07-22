import { Injectable } from '@nestjs/common';
import { Geolocator, GeoLocatorInput, GeoLocatorOutput } from './geolocator';
import { HttpService } from '@nestjs/axios';
import { env } from 'process';

export const GoogleMapsApiUrl = `http://maps.google.com/maps/api/geocode/json?key=${env.GOOGLE_MAPS_API_KEY}`;

@Injectable()
export class GeoLocatorService implements Geolocator {
	constructor(protected httpService: HttpService) {}

	public async coordinates(
		input: GeoLocatorInput,
	): Promise<GeoLocatorOutput> {
		const response = this.httpService.get(
			`${GoogleMapsApiUrl}&address=${input.locality}+${input.subArea}+${input.area}+${input.countryCode}`,
		);

		return new GeoLocatorOutput(0, 0);
	}
}

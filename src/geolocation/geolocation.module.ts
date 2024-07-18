import { Module } from '@nestjs/common';
import { Providers } from './geolocator.provider';

@Module({
	providers: [...Providers],
	exports: [...Providers],
})
export class GeolocationModule {}

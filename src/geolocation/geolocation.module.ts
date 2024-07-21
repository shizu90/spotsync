import { Module } from '@nestjs/common';
import { Providers } from './geolocator.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [...Providers],
	exports: [...Providers],
})
export class GeolocationModule {}

import { Provider } from '@nestjs/common';
import { GeoLocatorProvider } from './geolocator';
import { GeoLocatorService } from './geolocator.service';

export const Providers: Provider[] = [
  {
    provide: GeoLocatorProvider,
    useClass: GeoLocatorService,
  },
];

import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	GeoLocatorInput,
	GeoLocatorProvider,
} from 'src/geolocation/geolocator';
import { GeoLocatorService } from 'src/geolocation/geolocator.service';
import { UpdateSpotCommand } from '../ports/in/commands/update-spot.command';
import { UpdateSpotUseCase } from '../ports/in/use-cases/update-spot.use-case';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../ports/out/spot.repository';
import { SpotAlreadyExistsError } from './errors/spot-already-exists.error';
import { SpotNotFoundError } from './errors/spot-not-found.error';

@Injectable()
export class UpdateSpotService implements UpdateSpotUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GeoLocatorProvider)
		protected geoLocatorService: GeoLocatorService,
	) {}

	public async execute(command: UpdateSpotCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const spot = await this.spotRepository.findById(command.id);

		if (spot === null || spot === undefined || spot.isDeleted()) {
			throw new SpotNotFoundError();
		}

		if (spot.creator().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		if (
			command.name !== null &&
			command.name !== undefined &&
			command.name.length > 0
		) {
			if (
				command.name !== spot.name() &&
				(await this.spotRepository.findByName(command.name)) !== null
			) {
				throw new SpotAlreadyExistsError();
			}

			spot.changeName(command.name);
		}

		if (
			command.description !== null &&
			command.description !== undefined &&
			command.description.length > 0
		) {
			spot.changeDescription(command.description);
		}

		if (command.type !== null && command.type !== undefined) {
			spot.changeType(command.type);
		}

		if (command.address !== null && command.address !== undefined) {
			const address = spot.address();

			if (
				command.address.area !== null &&
				command.address.area !== undefined &&
				command.address.area.length > 0
			) {
				address.changeArea(command.address.area);
			}

			if (
				command.address.subArea !== null &&
				command.address.subArea !== undefined &&
				command.address.subArea.length > 0
			) {
				address.changeSubArea(command.address.subArea);
			}

			if (
				command.address.countryCode !== null &&
				command.address.countryCode !== undefined &&
				command.address.countryCode.length > 0
			) {
				address.changeCountryCode(command.address.countryCode);
			}

			if (
				command.address.locality !== null &&
				command.address.locality !== undefined &&
				command.address.locality.length > 0
			) {
				address.changeLocality(command.address.locality);
			}

			if (
				command.address.latitude !== null &&
				command.address.latitude !== undefined &&
				command.address.longitude !== null &&
				command.address.longitude !== undefined
			) {
				address.changeLatitude(command.address.latitude);
				address.changeLongitude(command.address.longitude);
			} else {
				const coordinates = await this.geoLocatorService.coordinates(
					new GeoLocatorInput(
						address.area(),
						address.subArea(),
						address.locality(),
						address.countryCode(),
					),
				);

				address.changeLatitude(coordinates.latitude);
				address.changeLongitude(coordinates.longitude);
			}
		}

		await this.spotRepository.update(spot);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GeoLocatorInput,
	GeoLocatorProvider,
} from 'src/geolocation/geolocator';
import { GeoLocatorService } from 'src/geolocation/geolocator.service';
import { SpotAddress } from 'src/spot/domain/spot-address.model';
import { Spot } from 'src/spot/domain/spot.model';
import { CreateSpotCommand } from '../ports/in/commands/create-spot.command';
import { CreateSpotUseCase } from '../ports/in/use-cases/create-spot.use-case';
import { CreateSpotDto } from '../ports/out/dto/create-spot.dto';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../ports/out/spot.repository';
import { SpotAlreadyExistsError } from './errors/spot-already-exists.error';

@Injectable()
export class CreateSpotService implements CreateSpotUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(GeoLocatorProvider)
		protected geoLocatorService: GeoLocatorService,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: CreateSpotCommand): Promise<CreateSpotDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		if ((await this.spotRepository.findByName(command.name)) !== null) {
			throw new SpotAlreadyExistsError();
		}

		let latitude = command.address.latitude;
		let longitude = command.address.longitude;

		if (
			(latitude === null || latitude === undefined) &&
			(longitude === null || longitude === undefined)
		) {
			const coordinates = await this.geoLocatorService.coordinates(
				new GeoLocatorInput(
					command.address.area,
					command.address.subArea,
					command.address.locality,
					command.address.countryCode,
				),
			);

			latitude = coordinates.latitude;
			longitude = coordinates.longitude;
		}

		const spotId = randomUUID();

		const spotAddress = SpotAddress.create(
			spotId,
			command.address.area,
			command.address.subArea,
			latitude,
			longitude,
			command.address.countryCode,
			command.address.locality,
		);

		const spot = Spot.create(
			spotId,
			command.name,
			command.description,
			command.type,
			spotAddress,
			[],
			authenticatedUser,
		);

		await this.spotRepository.store(spot);

		return new CreateSpotDto(
			spot.id(),
			spot.name(),
			spot.description(),
			spot.type(),
			{
				area: spot.address().area(),
				sub_area: spot.address().subArea(),
				latitude: spot.address().latitude(),
				longitude: spot.address().longitude(),
				country_code: spot.address().countryCode(),
				locality: spot.address().locality(),
			},
			spot.photos().map((p) => {
				return { id: p.id(), file_path: p.filePath() };
			}),
			spot.creator().id(),
			spot.createdAt(),
			spot.updatedAt(),
		);
	}
}

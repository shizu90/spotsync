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
import { calculateDistance } from 'src/spot/domain/calculate-distance.helper';
import { SpotAddress } from 'src/spot/domain/spot-address.model';
import { SpotPhoto } from 'src/spot/domain/spot-photo.model';
import { Spot } from 'src/spot/domain/spot.model';
import { FileStorage, FileStorageProvider } from 'src/storage/file-storage';
import { UserAddressRepository, UserAddressRepositoryProvider } from 'src/user/application/ports/out/user-address.repository';
import { CreateSpotCommand } from '../ports/in/commands/create-spot.command';
import { CreateSpotUseCase } from '../ports/in/use-cases/create-spot.use-case';
import { SpotDto } from '../ports/out/dto/spot.dto';
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
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(FileStorageProvider)
		protected fileStorage: FileStorage,
	) {}

	public async execute(command: CreateSpotCommand): Promise<SpotDto> {
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
					command.address.countryCode,
					command.address.locality,
					command.address.streetNumber,
					command.address.postalCode,
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
			command.address.streetNumber,
			command.address.postalCode,
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

		if (command.photos) {
			for (const photo of command.photos) {
				const savedFile = await this.fileStorage.save(
					`spots/${spotId}/photos`,
					photo,
				);

				spot.addPhoto(SpotPhoto.create(
					randomUUID(),
					savedFile.path,
					savedFile.content,
					photo.mimetype
				))
			}
		}

		const mainAddress = (await this.userAddressRepository.findBy({
			userId: authenticatedUser.id(),
			main: true,
		})).at(0);

		let distance = 0;

		if (mainAddress !== null && mainAddress !== undefined) {
			distance = calculateDistance(
				{ lat: mainAddress.latitude(), long: mainAddress.longitude() },
				{
					lat: spot.address().latitude(),
					long: spot.address().longitude(),
				},
			);
		}

		await this.spotRepository.store(spot);

		return SpotDto.fromModel(spot)
			.setTotalFavorites(0)
			.setTotalSpotVisits(0)
			.setVisitedAt(null)
			.setFavoritedAt(null)
			.setDistance(distance)
			.setAverageRating(0);
	}
}

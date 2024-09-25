import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { FavoriteRepository, FavoriteRepositoryProvider } from 'src/favorite/application/ports/out/favorite.repository';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';
import { calculateDistance } from 'src/spot/domain/calculate-distance.helper';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from 'src/user/application/ports/out/user-address.repository';
import { GetSpotCommand } from '../ports/in/commands/get-spot.command';
import { GetSpotUseCase } from '../ports/in/use-cases/get-spot.use-case';
import { GetSpotDto } from '../ports/out/dto/get-spot.dto';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../ports/out/spot.repository';
import { SpotNotFoundError } from './errors/spot-not-found.error';

@Injectable()
export class GetSpotService implements GetSpotUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(FavoriteRepositoryProvider)
		protected favoriteRepository: FavoriteRepository,
	) {}

	public async execute(command: GetSpotCommand): Promise<GetSpotDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);
		const mainAddress = (
			await this.userAddressRepository.findBy({
				userId: authenticatedUser.id(),
				main: true,
			})
		).at(0);

		const spot = await this.spotRepository.findById(command.id);

		if (spot === null || spot === undefined || spot.isDeleted()) {
			throw new SpotNotFoundError(`Spot not found`);
		}

		const totalSpotVisits = await this.spotRepository.countVisitedSpotBy({
			spotId: spot.id(),
		});

		const totalFavorites = await this.spotRepository.countBy({
			favoritableId: spot.id(),
			favoritableSubject: FavoritableSubject.SPOT,
		});

		const visited = (
			await this.spotRepository.findVisitedSpotBy({
				userId: authenticatedUser.id(),
				spotId: spot.id(),
			})
		).at(0);

		const favorited = (
			await this.favoriteRepository.findBy({
				userId: authenticatedUser.id(),
				favoritableId: spot.id(),
				favoritableSubject: FavoritableSubject.SPOT,
			})
		).at(0);

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

		return new GetSpotDto(
			spot.id(),
			spot.name(),
			spot.description(),
			spot.type(),
			{
				area: spot.address().area(),
				sub_area: spot.address().subArea(),
				locality: spot.address().locality(),
				country_code: spot.address().countryCode(),
				latitude: spot.address().latitude(),
				longitude: spot.address().longitude(),
			},
			spot.photos().map((p) => {
				return { id: p.id(), file_path: p.filePath() };
			}),
			{
				id: spot.creator().id(),
				display_name: spot.creator().profile().displayName(),
				banner_picture: spot.creator().profile().bannerPicture(),
				credentials: {
					name: spot.creator().credentials().name(),
				},
				profile_picture: spot.creator().profile().profilePicture(),
			},
			distance,
			visited !== null && visited !== undefined,
			visited !== null && visited !== undefined
				? visited.visitedAt()
				: null,
			favorited !== null && favorited !== undefined,
			favorited !== null && favorited !== undefined
				? favorited.createdAt()
				: null,
			0,
			0,
			totalSpotVisits,
			totalFavorites,
			0,
			spot.createdAt(),
			spot.updatedAt(),
		);
	}
}

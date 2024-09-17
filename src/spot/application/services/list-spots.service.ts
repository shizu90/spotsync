import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { calculateDistance } from 'src/spot/domain/calculate-distance.helper';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from 'src/user/application/ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { ListSpotsCommand } from '../ports/in/commands/list-spots.command';
import { ListSpotsUseCase } from '../ports/in/use-cases/list-spots.use-case';
import { GetSpotDto } from '../ports/out/dto/get-spot.dto';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../ports/out/spot.repository';

@Injectable()
export class ListSpotsService implements ListSpotsUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListSpotsCommand,
	): Promise<Pagination<GetSpotDto> | Array<GetSpotDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);
		const mainAddress = (
			await this.userAddressRepository.findBy({
				userId: authenticatedUser.id(),
				main: true,
			})
		).at(0);

		if (
			command.favoritedById !== null &&
			command.favoritedById !== undefined
		) {
			const favoritedBy = await this.userRepository.findById(
				command.favoritedById,
			);

			if (favoritedBy !== null && favoritedBy !== undefined) {
				switch (favoritedBy.visibilitySettings().favoriteSpots()) {
					case UserVisibility.FOLLOWERS:
						const follow = (
							await this.followRepository.findBy({
								fromUserId: authenticatedUser.id(),
								toUserId: favoritedBy.id(),
							})
						).at(0);

						if (follow === null || follow === undefined) {
							throw new UnauthorizedAccessError(
								`Unauthorized access`,
							);
						}

						break;
					case UserVisibility.PRIVATE:
						throw new UnauthorizedAccessError(
							`Unauthorized access`,
						);
					case UserVisibility.PUBLIC:
					default:
						break;
				}
			}
		}

		if (command.visitedById !== null && command.visitedById !== undefined) {
			const visitedBy = await this.userRepository.findById(
				command.visitedById,
			);

			if (visitedBy !== null && visitedBy !== undefined) {
				switch (visitedBy.visibilitySettings().visitedSpots()) {
					case UserVisibility.FOLLOWERS:
						const follow = (
							await this.followRepository.findBy({
								fromUserId: authenticatedUser.id(),
								toUserId: visitedBy.id(),
							})
						).at(0);

						if (follow === null || follow === undefined) {
							throw new UnauthorizedAccessError(
								`Unauthorized access`,
							);
						}

						break;
					case UserVisibility.PRIVATE:
						throw new UnauthorizedAccessError(
							`Unauthorized access`,
						);
					case UserVisibility.PUBLIC:
					default:
						break;
				}
			}
		}

		const spots = await this.spotRepository.paginate({
			filters: {
				name: command.name,
				type: command.type,
				creatorId: command.creatorId,
				favoritedById: command.favoritedById,
				visitedById: command.visitedById,
				isDeleted: false,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			page: command.page,
			limit: command.limit,
			paginate: command.paginate,
		});

		const items = await Promise.all(
			spots.items.map(async (s) => {
				const totalSpotVisits =
					await this.spotRepository.countVisitedSpotBy({
						spotId: s.id(),
					});

				const totalFavorites =
					await this.spotRepository.countFavoritedSpotBy({
						spotId: s.id(),
					});

				const visited = (
					await this.spotRepository.findVisitedSpotBy({
						userId: authenticatedUser.id(),
						spotId: s.id(),
					})
				).at(0);

				const favorited = (
					await this.spotRepository.findFavoritedSpotBy({
						userId: authenticatedUser.id(),
						spotId: s.id(),
					})
				).at(0);

				let distance = 0;

				if (mainAddress !== null && mainAddress !== undefined) {
					distance = calculateDistance(
						{
							lat: mainAddress.latitude(),
							long: mainAddress.longitude(),
						},
						{
							lat: s.address().latitude(),
							long: s.address().longitude(),
						},
					);
				}

				return new GetSpotDto(
					s.id(),
					s.name(),
					s.description(),
					s.type(),
					{
						area: s.address().area(),
						sub_area: s.address().subArea(),
						locality: s.address().locality(),
						country_code: s.address().countryCode(),
						latitude: s.address().latitude(),
						longitude: s.address().longitude(),
					},
					s.photos().map((p) => {
						return { id: p.id(), file_path: p.filePath() };
					}),
					{
						id: s.creator().id(),
						display_name: s.creator().profile().displayName(),
						banner_picture: s.creator().profile().bannerPicture(),
						credentials: {
							name: s.creator().credentials().name(),
						},
						profile_picture: s.creator().profile().profilePicture(),
					},
					distance,
					visited !== null && visited !== undefined,
					visited !== null && visited !== undefined
						? visited.visitedAt()
						: null,
					favorited !== null && favorited !== undefined,
					favorited !== null && favorited !== undefined
						? favorited.favoritedAt()
						: null,
					0,
					0,
					totalSpotVisits,
					totalFavorites,
					0,
					s.createdAt(),
					s.updatedAt(),
				);
			}),
		);

		if (!command.paginate) {
			return items
		}

		return new Pagination(items, spots.total, spots.current_page, spots.limit);
	}
}

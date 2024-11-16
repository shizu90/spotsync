import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
import {
	FavoriteRepository,
	FavoriteRepositoryProvider,
} from 'src/favorite/application/ports/out/favorite.repository';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';
import { CalculateAverageRatingCommand } from 'src/rating/application/ports/in/commands/calculate-average-rating.command';
import { CalculateAverageRatingUseCase, CalculateAverageRatingUseCaseProvider } from 'src/rating/application/ports/in/use-cases/calculate-average-rating.use-case';
import { RatableSubject } from 'src/rating/domain/ratable-subject.enum';
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
import { SpotDto } from '../ports/out/dto/spot.dto';
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
		@Inject(FavoriteRepositoryProvider)
		protected favoriteRepository: FavoriteRepository,
		@Inject(CalculateAverageRatingUseCaseProvider)
		protected calculateAverageRatingUseCase: CalculateAverageRatingUseCase,
	) {}

	public async execute(
		command: ListSpotsCommand,
	): Promise<Pagination<SpotDto> | Array<SpotDto>> {
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

			if (
				favoritedBy !== null &&
				favoritedBy !== undefined &&
				favoritedBy.id() !== authenticatedUser.id()
			) {
				switch (favoritedBy.visibilitySettings().favoriteSpots()) {
					case UserVisibility.FOLLOWERS:
						const isFollowing =
							(
								await this.followRepository.findBy({
									fromUserId: authenticatedUser.id(),
									toUserId: favoritedBy.id(),
									status: FollowStatus.ACTIVE,
								})
							).length > 0;

						if (!isFollowing) {
							throw new UnauthorizedAccessError();
						}

						break;
					case UserVisibility.PRIVATE:
						throw new UnauthorizedAccessError();
					case UserVisibility.PUBLIC:
					default:
						break;
				}
			}
		}

		if (
			command.visitedById !== null &&
			command.visitedById !== undefined &&
			command.visitedById !== authenticatedUser.id()
		) {
			const visitedBy = await this.userRepository.findById(
				command.visitedById,
			);

			if (visitedBy !== null && visitedBy !== undefined) {
				switch (visitedBy.visibilitySettings().visitedSpots()) {
					case UserVisibility.FOLLOWERS:
						const isFollowing =
							(
								await this.followRepository.findBy({
									fromUserId: authenticatedUser.id(),
									toUserId: visitedBy.id(),
									status: FollowStatus.ACTIVE,
								})
							).length > 0;

						if (!isFollowing) {
							throw new UnauthorizedAccessError();
						}

						break;
					case UserVisibility.PRIVATE:
						throw new UnauthorizedAccessError();
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

				const totalFavorites = await this.favoriteRepository.countBy({
					subjectId: s.id(),
					subject: FavoritableSubject.SPOT,
				});

				const visited = (
					await this.spotRepository.findVisitedSpotBy({
						userId: authenticatedUser.id(),
						spotId: s.id(),
					})
				).at(0);

				const favorited = (
					await this.favoriteRepository.findBy({
						userId: authenticatedUser.id(),
						subjectId: s.id(),
						subject: FavoritableSubject.SPOT,
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

				const avgRating = await this.calculateAverageRatingUseCase.execute(new CalculateAverageRatingCommand(
					RatableSubject.SPOT,
					s.id(),
				));

				const totalVisits = await this.spotRepository.countVisitedSpotBy({
					spotId: s.id(),
				});

				return SpotDto.fromModel(s)
					.setVisitedAt(visited?.visitedAt())
					.setFavoritedAt(favorited?.createdAt())
					.setTotalFavorites(totalFavorites)
					.setTotalSpotVisits(totalSpotVisits)
					.setDistance(distance)
					.setAverageRating(avgRating)
					.setTotalVisits(totalVisits);
			}),
		);

		if (!command.paginate) {
			return items;
		}

		return new Pagination(
			items,
			spots.total,
			spots.current_page,
			spots.limit,
		);
	}
}

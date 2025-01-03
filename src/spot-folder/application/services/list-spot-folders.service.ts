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
import { SpotFolderVisibility } from 'src/spot-folder/domain/spot-folder-visibility.enum';
import { ListSpotFoldersCommand } from '../ports/in/commands/list-spot-folders.command';
import { ListSpotFoldersUseCase } from '../ports/in/use-cases/list-spot-folders.use-case';
import { SpotFolderDto } from '../ports/out/dto/spot-folder.dto';
import {
	SpotFolderRepository,
	SpotFolderRepositoryProvider,
} from '../ports/out/spot-folder.repository';

@Injectable()
export class ListSpotFoldersService implements ListSpotFoldersUseCase {
	constructor(
		@Inject(SpotFolderRepositoryProvider)
		protected spotFolderRepository: SpotFolderRepository,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
		@Inject(FavoriteRepositoryProvider)
		protected favoriteRepository: FavoriteRepository,
		@Inject(CalculateAverageRatingUseCaseProvider)
		protected calculateAverageRatingUseCase: CalculateAverageRatingUseCase,
	) {}

	public async execute(
		command: ListSpotFoldersCommand,
	): Promise<Pagination<SpotFolderDto> | Array<SpotFolderDto>> {
		const authenticatedUser =
			await this.getAuthenticatedUserUseCase.execute(null);

		const pagination = await this.spotFolderRepository.paginate({
			filters: {
				userId: command.creatorId,
				name: command.name,
			},
			limit: command.limit,
			page: command.page,
			sort: command.sort,
			sortDirection: command.sortDirection,
			paginate: command.paginate,
		});

		const spotFolders = await Promise.all(
			pagination.items.map(async (spotFolder) => {
				if (spotFolder.creator().id() !== authenticatedUser.id()) {
					if (
						spotFolder.visibility() === SpotFolderVisibility.PRIVATE
					) {
						throw new UnauthorizedAccessError();
					}

					if (
						spotFolder.visibility() ===
						SpotFolderVisibility.FOLLOWERS
					) {
						const isFollowing =
							(
								await this.followRepository.findBy({
									fromUserId: authenticatedUser.id(),
									toUserId: spotFolder.creator().id(),
									status: FollowStatus.ACTIVE,
								})
							).length > 0;

						if (
							!isFollowing &&
							authenticatedUser.id() !== spotFolder.creator().id()
						)
							throw new UnauthorizedAccessError();
					}
				}

				const totalFavorites = await this.favoriteRepository.countBy({
					subject: FavoritableSubject.SPOT_FOLDER,
					subjectId: spotFolder.id(),
				});

				const favorited = (
					await this.favoriteRepository.findBy({
						subject: FavoritableSubject.SPOT_FOLDER,
						subjectId: spotFolder.id(),
						userId: authenticatedUser.id(),
					})
				).at(0);

				const avgRating = await this.calculateAverageRatingUseCase.execute(new CalculateAverageRatingCommand(
					RatableSubject.SPOT_FOLDER,
					spotFolder.id(),
				));

				return SpotFolderDto.fromModel(spotFolder)
					.setFavoritedAt(favorited?.createdAt())
					.setTotalFavorites(totalFavorites)
					.setAverageRating(avgRating);
			}),
		);

		if (command.paginate) {
			return new Pagination(
				spotFolders,
				pagination.total,
				pagination.current_page,
				pagination.limit,
			);
		} else {
			return spotFolders;
		}
	}
}

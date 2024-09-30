import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
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
import { SpotFolderVisibility } from 'src/spot-folder/domain/spot-folder-visibility.enum';
import { GetSpotFolderCommand } from '../ports/in/commands/get-spot-folder.command';
import { GetSpotFolderUseCase } from '../ports/in/use-cases/get-spot-folder.use-case';
import { SpotFolderDto } from '../ports/out/dto/spot-folder.dto';
import {
	SpotFolderRepository,
	SpotFolderRepositoryProvider,
} from '../ports/out/spot-folder.repository';
import { SpotFolderNotFoundError } from './errors/spot-folder-not-found.error';

@Injectable()
export class GetSpotFolderService implements GetSpotFolderUseCase {
	constructor(
		@Inject(SpotFolderRepositoryProvider)
		protected spotFolderRepository: SpotFolderRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(FavoriteRepositoryProvider)
		protected favoriteRepository: FavoriteRepository,
	) {}

	public async execute(
		command: GetSpotFolderCommand,
	): Promise<SpotFolderDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const spotFolder = await this.spotFolderRepository.findById(command.id);

		if (spotFolder === null || spotFolder === undefined) {
			throw new SpotFolderNotFoundError();
		}

		if (
			spotFolder.visibility() === SpotFolderVisibility.PRIVATE &&
			spotFolder.creator().id() !== authenticatedUser.id()
		) {
			throw new SpotFolderNotFoundError();
		}

		if (spotFolder.visibility() === SpotFolderVisibility.FOLLOWERS) {
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
			) {
				throw new SpotFolderNotFoundError();
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

		return SpotFolderDto.fromModel(spotFolder)
			.setFavoritedAt(favorited?.createdAt())
			.setTotalFavorites(totalFavorites);
	}
}

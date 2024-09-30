import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	FavoriteRepository,
	FavoriteRepositoryProvider,
} from 'src/favorite/application/ports/out/favorite.repository';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';
import { SortItemsCommand } from '../ports/in/commands/sort-items.command';
import { SortItemsUseCase } from '../ports/in/use-cases/sort-items.use-case';
import { SpotFolderDto } from '../ports/out/dto/spot-folder.dto';
import {
	SpotFolderRepository,
	SpotFolderRepositoryProvider,
} from '../ports/out/spot-folder.repository';
import { SpotFolderNotFoundError } from './errors/spot-folder-not-found.error';

@Injectable()
export class SortItemsService implements SortItemsUseCase {
	constructor(
		@Inject(SpotFolderRepositoryProvider)
		protected spotFolderRepository: SpotFolderRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthentiatedUser: GetAuthenticatedUserUseCase,
		@Inject(FavoriteRepositoryProvider)
		protected favoriteRepository: FavoriteRepository,
	) {}

	public async execute(command: SortItemsCommand): Promise<SpotFolderDto> {
		const authenticatedUser = await this.getAuthentiatedUser.execute(null);

		const spotFolder = await this.spotFolderRepository.findById(
			command.spotFolderId,
		);

		if (spotFolder === null || spotFolder === undefined) {
			throw new SpotFolderNotFoundError();
		}

		if (spotFolder.creator().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		spotFolder.sortItems();

		await this.spotFolderRepository.update(spotFolder);

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
			.setTotalFavorites(totalFavorites)
			.setFavoritedAt(favorited?.createdAt());
	}
}

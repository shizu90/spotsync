import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { DeleteSpotFolderCommand } from '../ports/in/commands/delete-spot-folder.command';
import { DeleteSpotFolderUseCase } from '../ports/in/use-cases/delete-spot-folder.use-case';
import {
	SpotFolderRepository,
	SpotFolderRepositoryProvider,
} from '../ports/out/spot-folder.repository';
import { SpotFolderNotFoundError } from './errors/spot-folder-not-found.error';

@Injectable()
export class DeleteSpotFolderService implements DeleteSpotFolderUseCase {
	constructor(
		@Inject(SpotFolderRepositoryProvider)
		protected spotFolderRepository: SpotFolderRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: DeleteSpotFolderCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const spotFolder = await this.spotFolderRepository.findById(command.id);

		if (spotFolder === null || spotFolder === undefined) {
			throw new SpotFolderNotFoundError('Spot folder not found');
		}

		if (spotFolder.creator().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError('Unauthorized access');
		}

		await this.spotFolderRepository.delete(spotFolder.id());
	}
}

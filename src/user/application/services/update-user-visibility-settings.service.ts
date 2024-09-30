import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UpdateUserVisibilitySettingsCommand } from '../ports/in/commands/update-user-visibility-settings.command';
import { UpdateUserVisibilitySettingsUseCase } from '../ports/in/use-cases/update-user-visibility-settings.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';

@Injectable()
export class UpdateUserVisibilitySettingsService
	implements UpdateUserVisibilitySettingsUseCase
{
	public constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: UpdateUserVisibilitySettingsCommand,
	): Promise<void> {
		const user = await this.getAuthenticatedUser.execute(null);

		if (command.userId !== user.id()) {
			throw new UnauthorizedAccessError();
		}

		const userVisibilitySettings = user.visibilitySettings();

		if (command.profile && command.profile !== null) {
			userVisibilitySettings.changeProfile(command.profile);
		}

		if (command.addresses && command.addresses !== null) {
			userVisibilitySettings.changeAddresses(command.addresses);
		}

		if (command.spotFolders && command.spotFolders !== null) {
			userVisibilitySettings.changeSpotFolders(command.spotFolders);
		}

		if (command.visitedSpots && command.visitedSpots !== null) {
			userVisibilitySettings.changeVisitedSpots(command.visitedSpots);
		}

		if (command.posts && command.posts !== null) {
			userVisibilitySettings.changePosts(command.posts);
		}

		if (command.favoriteSpots && command.favoriteSpots !== null) {
			userVisibilitySettings.changeFavoriteSpots(command.favoriteSpots);
		}

		if (
			command.favoriteSpotFolders &&
			command.favoriteSpotFolders !== null
		) {
			userVisibilitySettings.changeFavoriteSpotFolders(
				command.favoriteSpotFolders,
			);
		}

		if (command.favoriteSpotEvents && command.favoriteSpotEvents !== null) {
			userVisibilitySettings.changeFavoriteSpotEvents(
				command.favoriteSpotEvents,
			);
		}

		this.userRepository.updateVisibilitySettings(userVisibilitySettings);
	}
}

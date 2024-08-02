import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UpdateUserVisibilityConfigCommand } from '../ports/in/commands/update-user-visibility-config.command';
import { UpdateUserVisibilityConfigUseCase } from '../ports/in/use-cases/update-user-visibility-config.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';

@Injectable()
export class UpdateUserVisibilityConfigService
	implements UpdateUserVisibilityConfigUseCase
{
	public constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: UpdateUserVisibilityConfigCommand,
	): Promise<void> {
		const user = await this.getAuthenticatedUser.execute(null);

		if (command.userId !== user.id()) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		const userVisibilityConfig = user.visibilityConfiguration();

		if (command.profile && command.profile !== null) {
			userVisibilityConfig.changeProfile(command.profile);
		}

		if (command.addresses && command.addresses !== null) {
			userVisibilityConfig.changeAddresses(command.addresses);
		}

		if (command.spotFolders && command.spotFolders !== null) {
			userVisibilityConfig.changeSpotFolders(command.spotFolders);
		}

		if (command.visitedSpots && command.visitedSpots !== null) {
			userVisibilityConfig.changeVisitedSpots(command.visitedSpots);
		}

		if (command.posts && command.posts !== null) {
			userVisibilityConfig.changePosts(command.posts);
		}

		if (command.favoriteSpots && command.favoriteSpots !== null) {
			userVisibilityConfig.changeFavoriteSpots(command.favoriteSpots);
		}

		if (
			command.favoriteSpotFolders &&
			command.favoriteSpotFolders !== null
		) {
			userVisibilityConfig.changeFavoriteSpotFolders(
				command.favoriteSpotFolders,
			);
		}

		if (command.favoriteSpotEvents && command.favoriteSpotEvents !== null) {
			userVisibilityConfig.changeFavoriteSpotEvents(
				command.favoriteSpotEvents,
			);
		}

		user.changeVisibilityConfig(userVisibilityConfig);

		this.userRepository.updateVisibilityConfig(
			user.visibilityConfiguration(),
		);
	}
}

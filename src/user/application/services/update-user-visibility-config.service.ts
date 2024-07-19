import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserVisibilityConfigUseCase } from '../ports/in/use-cases/update-user-visibility-config.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { UpdateUserVisibilityConfigCommand } from '../ports/in/commands/update-user-visibility-config.command';
import { UserNotFoundError } from './errors/user-not-found.error';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';

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
		const user = await this.userRepository.findById(command.userId);

		if (user === null || user === undefined || user.isDeleted()) {
			throw new UserNotFoundError(`User not found`);
		}

		if (user.id() !== this.getAuthenticatedUser.execute(null)) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		const userVisibilityConfig = user.visibilityConfiguration();

		if (command.profileVisibility && command.profileVisibility !== null) {
			userVisibilityConfig.changeProfileVisibility(
				command.profileVisibility,
			);
		}

		if (command.addressVisibility && command.addressVisibility !== null) {
			userVisibilityConfig.changeAddressVisibility(
				command.addressVisibility,
			);
		}

		if (
			command.poiFolderVisibility &&
			command.poiFolderVisibility !== null
		) {
			userVisibilityConfig.changePoiFolderVisibility(
				command.poiFolderVisibility,
			);
		}

		if (
			command.visitedPoiVisibility &&
			command.visitedPoiVisibility !== null
		) {
			userVisibilityConfig.changeVisitedPoiVisibility(
				command.visitedPoiVisibility,
			);
		}

		if (command.postVisibility && command.postVisibility !== null) {
			userVisibilityConfig.changePostVisibility(command.postVisibility);
		}

		user.changeVisibilityConfig(userVisibilityConfig);

		this.userRepository.updateVisibilityConfig(
			user.visibilityConfiguration(),
		);
	}
}

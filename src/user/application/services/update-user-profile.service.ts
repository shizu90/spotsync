import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UpdateUserProfileCommand } from '../ports/in/commands/update-user-profile.command';
import { UpdateUserProfileUseCase } from '../ports/in/use-cases/update-user-profile.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';

@Injectable()
export class UpdateUserProfileService implements UpdateUserProfileUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: UpdateUserProfileCommand): Promise<void> {
		const user = await this.getAuthenticatedUser.execute(null);

		if (command.id !== user.id()) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		if (
			command.displayName &&
			command.displayName !== null &&
			command.displayName.length > 0
		) {
			user.profile().changeDisplayName(command.displayName);
		}

		if (
			command.themeColor &&
			command.themeColor !== null &&
			command.themeColor.length > 0
		) {
			user.profile().changeThemeColor(command.themeColor);
		}

		if (
			command.biograph &&
			command.biograph !== null &&
			command.biograph.length > 0
		) {
			user.profile().changeBiograph(command.biograph);
		}

		if (command.birthDate && command.birthDate !== null) {
			user.changeBirthDate(command.birthDate);
		}

		this.userRepository.update(user);
		this.userRepository.updateProfile(user.profile());
	}
}

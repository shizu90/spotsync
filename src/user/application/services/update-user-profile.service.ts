import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserProfileUseCase } from '../ports/in/use-cases/update-user-profile.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { UpdateUserProfileCommand } from '../ports/in/commands/update-user-profile.command';
import { User } from 'src/user/domain/user.model';
import { UserNotFoundError } from './errors/user-not-found.error';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';

@Injectable()
export class UpdateUserProfileService implements UpdateUserProfileUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: UpdateUserProfileCommand): Promise<void> {
		const user: User = await this.userRepository.findById(command.id);

		if (user === null || user === undefined || user.isDeleted()) {
			throw new UserNotFoundError(`User not found`);
		}

		if (user.id() !== this.getAuthenticatedUser.execute(null)) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		if (
			command.firstName &&
			command.firstName !== null &&
			command.firstName.length > 0
		) {
			user.changeFirstName(command.firstName);
		}

		if (
			command.lastName &&
			command.lastName !== null &&
			command.lastName.length > 0
		) {
			user.changeLastName(command.lastName);
		}

		if (
			command.profileThemeColor &&
			command.profileThemeColor !== null &&
			command.profileThemeColor.length > 0
		) {
			user.changeProfileThemeColor(command.profileThemeColor);
		}

		if (
			command.biograph &&
			command.biograph !== null &&
			command.biograph.length > 0
		) {
			user.changeBiograph(command.biograph);
		}

		if (command.birthDate && command.birthDate !== null) {
			user.changeBirthDate(command.birthDate);
		}

		this.userRepository.update(user);
	}
}

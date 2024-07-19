import { User } from 'src/user/domain/user.model';
import { DeleteUserCommand } from '../ports/in/commands/delete-user.command';
import { DeleteUserUseCase } from '../ports/in/use-cases/delete-user.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { UserNotFoundError } from './errors/user-not-found.error';
import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';

@Injectable()
export class DeleteUserService implements DeleteUserUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: DeleteUserCommand): Promise<void> {
		const user: User = await this.userRepository.findById(command.id);

		if (user === null || user === undefined || user.isDeleted()) {
			throw new UserNotFoundError(`User not found`);
		}

		if (user.id() !== this.getAuthenticatedUser.execute(null)) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		user.delete();

		this.userRepository.update(user);
	}
}

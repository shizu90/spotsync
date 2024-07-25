import { Inject, Injectable } from '@nestjs/common';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { SignOutCommand } from '../ports/in/commands/sign-out.command';
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from '../ports/in/use-cases/get-authenticated-user.use-case';
import { SignOutUseCase } from '../ports/in/use-cases/sign-out.use-case';

@Injectable()
export class SignOutService implements SignOutUseCase {
	public constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase
	) {}

	public async execute(command: SignOutCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUserUseCase.execute(null);

		authenticatedUser.credentials().logout();

		this.userRepository.updateCredentials(authenticatedUser.credentials());
	}
}

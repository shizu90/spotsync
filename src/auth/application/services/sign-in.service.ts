import { Inject, Injectable } from '@nestjs/common';
import { env } from 'process';
import { TokenService } from 'src/auth/infrastructure/adapters/in/web/handlers/token.service';
import {
	EncryptPasswordService,
	EncryptPasswordServiceProvider,
} from 'src/user/application/ports/out/encrypt-password.service';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserInvalidCredentialsError } from 'src/user/application/services/errors/user-invalid-credentials.error';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { User } from 'src/user/domain/user.model';
import { SignInCommand } from '../ports/in/commands/sign-in.command';
import { SignInUseCase } from '../ports/in/use-cases/sign-in.use-case';
import { SignInDto } from '../ports/out/dto/sign-in.dto';

const REDIS_AUTH_TTL = env.REDIS_AUTH_TTL ?? 800;

@Injectable()
export class SignInService implements SignInUseCase {
	public constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(TokenService)
		protected tokenService: TokenService,
		@Inject(EncryptPasswordServiceProvider)
		protected encryptPasswordService: EncryptPasswordService,
	) {}

	public async execute(command: SignInCommand): Promise<SignInDto> {
		let user: User | null = null;

		if (command.name && command.name !== null) {
			user = await this.userRepository.findByName(command.name);
		}

		if (command.email && command.email !== null) {
			user = await this.userRepository.findByEmail(command.email);
		}

		if (
			user === null ||
			user === undefined ||
			user.isDeleted() ||
			user.isInactive()
		) {
			throw new UserNotFoundError();
		}

		if (
			!(await this.encryptPasswordService.equals(
				user.credentials().password(),
				command.password,
			))
		) {
			throw new UserInvalidCredentialsError(`Wrong password`);
		}

		user.credentials().login();

		this.userRepository.updateCredentials(user.credentials());

		const payload = { sub: user.id(), name: user.credentials().name() };

		const bearerToken = await this.tokenService.generateToken<{sub: string, name: string}>(payload);

		return new SignInDto(
			user.id(),
			bearerToken,
			user,
		);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/auth/application/ports/out/dto/sign-in.dto';
import { ActivationRequestStatus } from 'src/user/domain/activation-request-status.enum';
import { ActivationRequestSubject } from 'src/user/domain/activation-request-subject.enum';
import { ActivateUserCommand } from '../ports/in/commands/activate-user.command';
import { ActivateUserUseCase } from '../ports/in/use-cases/activate-user.use-case';
import {
	ActivationRequestRepository,
	ActivationRequestRepositoryProvider,
} from '../ports/out/activation-request.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { InvalidActivationCodeError } from './errors/invalid-activation-code.error';

@Injectable()
export class ActivateUserService implements ActivateUserUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(ActivationRequestRepositoryProvider)
		protected activationRequestRepository: ActivationRequestRepository,
		@Inject(JwtService)
		protected jwtService: JwtService,
	) {}

	public async execute(
		command: ActivateUserCommand,
	): Promise<void | SignInDto> {
		console.log(command);

		const activationRequest = (
			await this.activationRequestRepository.findBy({
				userId: command.userId,
				code: command.activationCode,
				status: ActivationRequestStatus.PENDING,
				subject: ActivationRequestSubject.NEW_USER,
			})
		).at(0);

		if (activationRequest === null || activationRequest === undefined) {
			throw new InvalidActivationCodeError();
		}

		const user = activationRequest.user();

		activationRequest.approve();

		user.activate();

		await this.activationRequestRepository.update(activationRequest);
		await this.userRepository.update(user);

		if (command.autoLogin) {
			user.credentials().login();

			this.userRepository.updateCredentials(user.credentials());

			const payload = { sub: user.id(), name: user.credentials().name() };

			const bearerToken = await this.jwtService.signAsync(payload);

			return new SignInDto(
				user.id(),
				user.credentials().name(),
				user.credentials().email(),
				bearerToken,
			);
		}
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Mail, MailProvider } from 'src/mail/mail';
import { ForgotPasswordMailTemplate } from 'src/mail/templates/forgot-password-mail.template';
import { PasswordRecoveryStatus } from 'src/user/domain/password-recovery-status.enum';
import { PasswordRecovery } from 'src/user/domain/password-recovery.model';
import { ForgotPasswordCommand } from '../ports/in/commands/forgot-password.command';
import { ForgotPasswordUseCase } from '../ports/in/use-cases/forgot-password.use-case';
import { PasswordRecoveryDto } from '../ports/out/dto/password-recovery.dto';
import {
	PasswordRecoveryRepository,
	PasswordRecoveryRepositoryProvider,
} from '../ports/out/password-recovery.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { AlreadyRequestedPasswordRecoveryError } from './errors/already-requested-password-recovery.error';
import { UserNotFoundError } from './errors/user-not-found.error';

@Injectable()
export class ForgotPasswordService implements ForgotPasswordUseCase {
	constructor(
		@Inject(PasswordRecoveryRepositoryProvider)
		protected passwordRecoveryRepository: PasswordRecoveryRepository,
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(MailProvider)
		protected mail: Mail,
	) {}

	public async execute(
		command: ForgotPasswordCommand,
	): Promise<PasswordRecoveryDto> {
		const user = await this.userRepository.findByEmail(command.email);

		if (user === null || user === undefined) {
			throw new UserNotFoundError();
		}

		const alreadyRequested = (await this.passwordRecoveryRepository.findBy({
			userId: user.id(),
			status: PasswordRecoveryStatus.NEW,
		})).length > 0;

		if (alreadyRequested) {
			throw new AlreadyRequestedPasswordRecoveryError();
		}

		const passwordRecovery = PasswordRecovery.create(randomUUID(), user);

		await this.passwordRecoveryRepository.store(passwordRecovery);

		this.mail
			.setReceiver(user.credentials().email())
			.setTemplate(
				new ForgotPasswordMailTemplate({
					email: user.credentials().email(),
					token: passwordRecovery.token(),
					userName: user.credentials().name(),
				}),
			)
			.send();

		return PasswordRecoveryDto.fromModel(passwordRecovery);
	}
}

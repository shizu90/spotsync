import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Mail, MailProvider } from "src/mail/mail";
import { ForgotPasswordMailTemplate } from "src/mail/templates/forgot-password-mail.template";
import { PasswordRecovery } from "src/user/domain/password-recovery.model";
import { ForgotPasswordCommand } from "../ports/in/commands/forgot-password.command";
import { ForgotPasswordUseCase } from "../ports/in/use-cases/forgot-password.use-case";
import { ForgotPasswordDto } from "../ports/out/dto/forgot-password.dto";
import { PasswordRecoveryRepository, PasswordRecoveryRepositoryProvider } from "../ports/out/password-recovery.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Injectable()
export class ForgotPasswordService implements ForgotPasswordUseCase {
    constructor(
        @Inject(PasswordRecoveryRepositoryProvider)
        protected passwordRecoveryRepository: PasswordRecoveryRepository,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(MailProvider)
        protected mail: Mail,
    ) 
    {}

    public async execute(command: ForgotPasswordCommand): Promise<ForgotPasswordDto> {
        const user = await this.userRepository.findByEmail(command.email);

        if (user === null || user === undefined) {
            throw new UserNotFoundError(`User not found`);
        }

        const passwordRecovery = PasswordRecovery.create(randomUUID(), user);

        await this.passwordRecoveryRepository.store(passwordRecovery);

        this.mail.setReceiver(user.credentials().email()).setTemplate(new ForgotPasswordMailTemplate({
            email: user.credentials().email(),
            token: passwordRecovery.token(),
            userName: user.credentials().name(),
        })).send();

        return new ForgotPasswordDto(
            passwordRecovery.id(),
            passwordRecovery.token(),
            passwordRecovery.status(),
            passwordRecovery.createdAt(),
            passwordRecovery.expiresAt(),
        );
    }
}
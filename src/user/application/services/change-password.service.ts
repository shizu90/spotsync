import { Inject, Injectable } from "@nestjs/common";
import { PasswordRecoveryStatus } from "src/user/domain/password-recovery-status.enum";
import { ChangePasswordCommand } from "../ports/in/commands/change-password.command";
import { ChangePasswordUseCase } from "../ports/in/use-cases/change-password.use-case";
import { EncryptPasswordService, EncryptPasswordServiceProvider } from "../ports/out/encrypt-password.service";
import { PasswordRecoveryRepository, PasswordRecoveryRepositoryProvider } from "../ports/out/password-recovery.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { PasswordRecoveryExpired } from "./errors/password-recovery-expired.error";

@Injectable()
export class ChangePasswordService implements ChangePasswordUseCase 
{
    constructor(
        @Inject(PasswordRecoveryRepositoryProvider)
        protected passwordRecoveryRepository: PasswordRecoveryRepository,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(EncryptPasswordServiceProvider)
		protected encryptPasswordService: EncryptPasswordService,
    ) 
    {}

    public async execute(command: ChangePasswordCommand): Promise<void> {
        const passwordRecovery = (await this.passwordRecoveryRepository.findBy({
            token: command.token,
            status: PasswordRecoveryStatus.NEW
        })).at(0);

        if (passwordRecovery === null || passwordRecovery === undefined) {
            throw new PasswordRecoveryExpired(`Password recovery is expired`);
        }

        if (passwordRecovery.isExpired()) {
            passwordRecovery.expire();

            await this.passwordRecoveryRepository.update(passwordRecovery);

            throw new PasswordRecoveryExpired(`Password recovery is expired`);
        }

        const user = passwordRecovery.user();

        user.credentials().changePassword(
            await this.encryptPasswordService.encrypt(command.password)
        );

        passwordRecovery.use();

        this.passwordRecoveryRepository.update(passwordRecovery);

        this.userRepository.updateCredentials(user.credentials());
    }
}
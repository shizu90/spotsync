import { User } from "src/user/domain/user.model";
import { UpdateUserCredentialsCommand } from "../ports/in/commands/update-user-credentials.command";
import { UpdateUserCredentialsUseCase } from "../ports/in/use-cases/update-user-credentials.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";
import { EncryptPasswordService, EncryptPasswordServiceProvider } from "../ports/out/encrypt-password.service";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class UpdateUserCredentialsService implements UpdateUserCredentialsUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository,
        @Inject(EncryptPasswordServiceProvider) 
        protected encryptPasswordService: EncryptPasswordService,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: UpdateUserCredentialsCommand): Promise<void> 
    {
        const user: User = await this.userRepository.findById(command.id);

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.id} not found`);
        }

        if(user.id() !== this.getAuthenticatedUser.execute(null)) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        if(command.email && user.credentials().email() !== command.email && (await this.userRepository.findByEmail(command.email)) !== null) {
            throw new UserAlreadyExistsError(`E-mail ${command.email} already in use`);
        }

        if(command.name && !(user.credentials().name() === command.name)) {
            user.credentials().changeName(command.name);
        }

        if(command.email && !(user.credentials().email() === command.email)) {
            user.credentials().changeEmail(command.email);
        }

        if(command.password && !(await this.encryptPasswordService.equals(user.credentials().password(), command.password))) {
            user.credentials().changePassword(await this.encryptPasswordService.encrypt(command.password));
        }

        this.userRepository.updateCredentials(user.credentials());
    }
}
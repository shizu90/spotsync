import { User } from "src/user/domain/user.model";
import { UpdateUserCredentialsCommand } from "../ports/in/update-user-credentials.command";
import { UpdateUserCredentialsUseCase } from "../ports/in/update-user-credentials.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";
import { EncryptPasswordService, EncryptPasswordServiceProvider } from "../ports/out/encrypt-password.service";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { Inject, Injectable } from "@nestjs/common";
import { UserCredentials } from "src/user/domain/user-credentials.model";

@Injectable()
export class UpdateUserCredentialsService implements UpdateUserCredentialsUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository,
        @Inject(EncryptPasswordServiceProvider) 
        protected encryptPasswordService: EncryptPasswordService
    ) 
    {}

    public async execute(command: UpdateUserCredentialsCommand): Promise<User> 
    {
        const user: User = await this.userRepository.findById(command.id);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.id} not found.`);
        }

        if(user.credentials().email() != command.email && this.userRepository.findByEmail(command.email) != null) {
            throw new UserAlreadyExistsError(`E-mail ${command.email} already in use.`);
        }

        if(!(user.credentials().name() == command.name)) {
            user.credentials().changeName(command.name);
        }

        if(!(user.credentials().email() == command.email)) {
            user.credentials().changeEmail(command.email);
        }

        if(!this.encryptPasswordService.equals(user.credentials().password(), command.password)) {
            user.credentials().changePassword(this.encryptPasswordService.encrypt(command.password));
        }

        this.userRepository.updateCredentials(user.credentials());

        return user;
    }
}
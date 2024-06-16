import { UserCredentials } from "src/user/domain/user-credentials.model";
import { CreateUserCommand } from "../ports/in/create-user.command";
import { CreateUserUseCase } from "../ports/in/create-user.use-case";
import { randomUUID } from "crypto";
import { User } from "src/user/domain/user.model";
import { UserRepository } from "../ports/out/user.repository";
import { UserCredentialsRepository } from "../ports/out/user-credentials.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";
import { Injectable } from "@nestjs/common";
import { EncryptPasswordService } from "../ports/out/encrypt-password.service";
import { ProfileVisibility } from "src/user/domain/profile-visibility.enum";

@Injectable()
export class CreateUserService implements CreateUserUseCase 
{
    constructor(
        protected userRepository: UserRepository, 
        protected userCredentialsRepository: UserCredentialsRepository,
        protected encryptPasswordService: EncryptPasswordService
    ) 
    {}
    
    public async execute(command: CreateUserCommand): Promise<User> 
    {
        if(this.userCredentialsRepository.findByEmail(command.email) != null) {
            throw new UserAlreadyExistsError(`E-mail ${command.email} already in use.`);
        }

        if(this.userCredentialsRepository.findByName(command.name) != null) {
            throw new UserAlreadyExistsError(`User name ${command.name} already taken.`);
        }

        let userCredentials: UserCredentials = UserCredentials.create(
            randomUUID(),
            command.name,
            command.email,
            this.encryptPasswordService.encrypt(command.password)
        );

        userCredentials = this.userCredentialsRepository.store(userCredentials);

        const user: User = User.create(
            randomUUID(),
            null,
            null,
            null,
            null,
            ProfileVisibility.PUBLIC,
            userCredentials
        );

        return this.userRepository.store(user);
    }
}
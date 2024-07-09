import { UserCredentials } from "src/user/domain/user-credentials.model";
import { CreateUserCommand } from "../ports/in/commands/create-user.command";
import { CreateUserUseCase } from "../ports/in/use-cases/create-user.use-case";
import { randomUUID } from "crypto";
import { User } from "src/user/domain/user.model";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";
import { Inject, Injectable } from "@nestjs/common";
import { EncryptPasswordService, EncryptPasswordServiceProvider } from "../ports/out/encrypt-password.service";
import { ProfileVisibility } from "src/user/domain/profile-visibility.enum";
import { CreateUserDto } from "../ports/out/dto/create-user.dto";

@Injectable()
export class CreateUserService implements CreateUserUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository,
        @Inject(EncryptPasswordServiceProvider) 
        protected encryptPasswordService: EncryptPasswordService
    ) 
    {}
    
    public async execute(command: CreateUserCommand): Promise<CreateUserDto> 
    {
        if(await this.userRepository.findByEmail(command.email) !== null) {
            throw new UserAlreadyExistsError(`E-mail ${command.email} already in use`);
        }

        if(await this.userRepository.findByName(command.name) !== null) {
            throw new UserAlreadyExistsError(`User name ${command.name} already taken`);
        }

        const userId = randomUUID();

        let userCredentials: UserCredentials = UserCredentials.create(
            userId,
            command.name,
            command.email,
            this.encryptPasswordService.encrypt(command.password)
        );

        const user: User = User.create(
            userId,
            null,
            null,
            null,
            new Date(command.birthDate),
            ProfileVisibility.PUBLIC,
            userCredentials
        );

        this.userRepository.store(user);

        return new CreateUserDto(
            user.id(),
            user.biograph(),
            user.profilePicture(),
            user.bannerPicture(),
            user.birthDate(),
            user.isDeleted(),
            user.createdAt(),
            user.updatedAt(),
            {name: user.credentials().name(), email: user.credentials().email()}
        );
    }
}
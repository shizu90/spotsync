import { UserCredentials } from "src/user/domain/user-credentials.model";
import { CreateUserCommand } from "../ports/in/commands/create-user.command";
import { CreateUserUseCase } from "../ports/in/use-cases/create-user.use-case";
import { randomUUID } from "crypto";
import { User } from "src/user/domain/user.model";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";
import { Inject, Injectable } from "@nestjs/common";
import { EncryptPasswordService, EncryptPasswordServiceProvider } from "../ports/out/encrypt-password.service";
import { CreateUserDto } from "../ports/out/dto/create-user.dto";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";

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
            await this.encryptPasswordService.encrypt(command.password)
        );

        const userVisibilityConfig: UserVisibilityConfig = UserVisibilityConfig.create(
            userId,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC
        );

        const user: User = User.create(
            userId,
            null,
            null,
            null,
            new Date(command.birthDate),
            userCredentials,
            userVisibilityConfig
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
            {
                profile_visibility: user.visibilityConfiguration().profileVisibility(),
                address_visibility: user.visibilityConfiguration().addressVisibility(),
                poi_folder_visibility: user.visibilityConfiguration().poiFolderVisibility(),
                visited_poi_visibility: user.visibilityConfiguration().visitedPoiVisibility(),
                post_visibility: user.visibilityConfiguration().postVisibility()
            },
            {name: user.credentials().name(), email: user.credentials().email()}
        );
    }
}
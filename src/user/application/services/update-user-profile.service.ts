import { Inject, Injectable } from "@nestjs/common";
import { UpdateUserProfileUseCase, UpdateUserProfileUseCaseProvider } from "../ports/in/update-user-profile.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UpdateUserProfileCommand } from "../ports/in/update-user-profile.command";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Injectable()
export class UpdateUserProfileService implements UpdateUserProfileUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: UpdateUserProfileCommand): Promise<User> 
    {
        const user: User = await this.userRepository.findById(command.id);

        if(user == null || user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.id} not found.`);
        }

        if(command.bannerPicture != null || command.bannerPicture != user.bannerPicture()) {
            user.changeBannerPicture(command.bannerPicture);
        }

        if(command.profilePicture != null || command.profilePicture != user.profilePicture()) {
            user.changeProfilePicture(command.profilePicture);
        }

        if(command.biograph != null || command.biograph != user.biograph()) {
            user.changeBiograph(command.biograph);
        }

        if(command.birthDate != null || command.birthDate != user.birthDate()) {
            user.changeBirthDate(command.birthDate);
        }

        this.userRepository.update(user);

        return user;
    }
}
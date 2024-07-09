import { Inject, Injectable } from "@nestjs/common";
import { UpdateUserVisibilityConfigUseCase } from "../ports/in/use-cases/update-user-visibility-config.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UpdateUserVisibilityConfigCommand } from "../ports/in/commands/update-user-visibility-config.command";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Injectable()
export class UpdateUserVisibilityConfigService implements UpdateUserVisibilityConfigUseCase 
{
    public constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: UpdateUserVisibilityConfigCommand): Promise<void> 
    {
        const user = await this.userRepository.findById(command.userId);

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.userId} not found`);
        }

        if(command.profileVisibility) {
            user.visibilityConfiguration().changeProfileVisibility(command.profileVisibility);
        }

        if(command.addressVisibility) {
            user.visibilityConfiguration().changeAddressVisibility(command.addressVisibility);
        }

        if(command.poiFolderVisibility) {
            user.visibilityConfiguration().changePoiFolderVisibility(command.poiFolderVisibility);
        }

        if(command.visitedPoiVisibility) {
            user.visibilityConfiguration().changeVisitedPoiVisibility(command.visitedPoiVisibility);
        }

        if(command.postVisibility) {
            user.visibilityConfiguration().changePostVisibility(command.postVisibility);
        }

        this.userRepository.updateVisibilityConfig(user.visibilityConfiguration());
    }
}
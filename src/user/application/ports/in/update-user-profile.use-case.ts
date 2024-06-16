import { UseCase } from "src/common/common.use-case";
import { UpdateUserProfileCommand } from "./update-user-profile.command";
import { User } from "src/user/domain/user.model";

export abstract class UpdateUserProfileUseCase implements UseCase<UpdateUserProfileCommand, Promise<User>> 
{
    abstract execute(command: UpdateUserProfileCommand): Promise<User>;
}
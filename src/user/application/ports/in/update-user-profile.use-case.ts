import { UseCase } from "src/common/common.use-case";
import { UpdateUserProfileCommand } from "./update-user-profile.command";
import { User } from "src/user/domain/user.model";

export const UpdateUserProfileUseCaseProvider = 'UpdateUserProfileUseCase';

export interface UpdateUserProfileUseCase extends UseCase<UpdateUserProfileCommand, Promise<User>> 
{}
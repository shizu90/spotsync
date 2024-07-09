import { UseCase } from "src/common/common.use-case";
import { UpdateUserGroupVisibilityCommand } from "../commands/update-user-group-visibility.command";

export const UpdateUserGroupVisibilityUseCaseProvider = "UpdateUserGroupVisibilityUseCase";

export interface UpdateUserGroupVisibilityUseCase extends UseCase<UpdateUserGroupVisibilityCommand, Promise<void>> 
{}
import { UseCase } from "src/common/common.use-case";
import { UpdateUserGroupCommand } from "../commands/update-user-group.command";

export const UpdateUserGroupUseCaseProvider = "UpdateUserGroupUseCase";

export interface UpdateUserGroupUseCase extends UseCase<UpdateUserGroupCommand, Promise<void>> 
{}
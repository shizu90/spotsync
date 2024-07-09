import { UseCase } from "src/common/common.use-case";
import { DeleteUserGroupCommand } from "../commands/delete-user-group.command";

export const DeleteUserGroupUseCaseProvider = "DeleteUserGroupUseCase";

export interface DeleteUserGroupUseCase extends UseCase<DeleteUserGroupCommand, Promise<void>> 
{}
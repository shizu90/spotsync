import { UseCase } from "src/common/common.use-case";
import { CreateUserGroupCommand } from "../commands/create-user-group.command";
import { CreateUserGroupDto } from "../../out/dto/create-user-group.dto";

export const CreateUserGroupUseCaseProvider = "CreateUserGroupUseCase";

export interface CreateUserGroupUseCase extends UseCase<CreateUserGroupCommand, Promise<CreateUserGroupDto>> 
{}
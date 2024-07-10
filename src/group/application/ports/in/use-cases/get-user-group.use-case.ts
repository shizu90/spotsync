import { UseCase } from "src/common/common.use-case";
import { GetUserGroupCommand } from "../commands/get-user-group.command";
import { GetUserGroupDto } from "../../out/dto/get-user-group.dto";

export const GetUserGroupUseCaseProvider = "GetUserGroupUseCase";

export interface GetUserGroupUseCase extends UseCase<GetUserGroupCommand, Promise<GetUserGroupDto>> 
{}
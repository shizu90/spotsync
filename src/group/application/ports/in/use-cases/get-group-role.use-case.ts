import { UseCase } from "src/common/common.use-case";
import { GetGroupRoleCommand } from "../commands/get-group-role.command";
import { GetGroupRoleDto } from "../../out/dto/get-group-role.dto";

export const GetGroupRoleUseCaseProvider = "GetGroupRoleUseCase";

export interface GetGroupRoleUseCase extends UseCase<GetGroupRoleCommand, Promise<GetGroupRoleDto>> 
{}
import { UseCase } from "src/common/common.use-case";
import { GetGroupRoleDto } from "../../out/dto/get-group-role.dto";
import { Pagination } from "src/common/pagination.dto";
import { ListGroupRolesCommand } from "../commands/list-group-roles.command";

export const ListGroupRolesUseCaseProvider = "ListGroupRolesUseCase";

export interface ListGroupRolesUseCase extends UseCase<ListGroupRolesCommand, Promise<Array<GetGroupRoleDto> | Pagination<GetGroupRoleDto>>> 
{} 
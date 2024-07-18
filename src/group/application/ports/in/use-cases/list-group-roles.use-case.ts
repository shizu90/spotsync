import { UseCase } from 'src/common/common.use-case';
import { GetGroupRoleDto } from '../../out/dto/get-group-role.dto';
import { ListGroupRolesCommand } from '../commands/list-group-roles.command';
import { Pagination } from 'src/common/common.repository';

export const ListGroupRolesUseCaseProvider = 'ListGroupRolesUseCase';

export interface ListGroupRolesUseCase
  extends UseCase<
    ListGroupRolesCommand,
    Promise<Pagination<GetGroupRoleDto>>
  > {}

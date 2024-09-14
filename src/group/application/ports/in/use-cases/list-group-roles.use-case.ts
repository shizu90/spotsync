import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetGroupRoleDto } from '../../out/dto/get-group-role.dto';
import { ListGroupRolesCommand } from '../commands/list-group-roles.command';

export const ListGroupRolesUseCaseProvider = 'ListGroupRolesUseCase';

export interface ListGroupRolesUseCase
	extends UseCase<
		ListGroupRolesCommand,
		Promise<Pagination<GetGroupRoleDto> | Array<GetGroupRoleDto>>
	> {}

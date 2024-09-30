import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GroupDto } from '../../out/dto/group.dto';
import { ListGroupsCommand } from '../commands/list-groups.command';

export const ListGroupsUseCaseProvider = 'ListGroupsUseCase';

export interface ListGroupsUseCase
	extends UseCase<
		ListGroupsCommand,
		Promise<Pagination<GroupDto> | Array<GroupDto>>
	> {}

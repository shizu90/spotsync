import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetGroupDto } from '../../out/dto/get-group.dto';
import { ListGroupsCommand } from '../commands/list-groups.command';

export const ListGroupsUseCaseProvider = 'ListGroupsUseCase';

export interface ListGroupsUseCase
	extends UseCase<ListGroupsCommand, Promise<Pagination<GetGroupDto>>> {}

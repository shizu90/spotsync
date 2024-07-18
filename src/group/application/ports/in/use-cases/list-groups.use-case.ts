import { UseCase } from 'src/common/common.use-case';
import { ListGroupsCommand } from '../commands/list-groups.command';
import { GetGroupDto } from '../../out/dto/get-group.dto';
import { Pagination } from 'src/common/common.repository';

export const ListGroupsUseCaseProvider = 'ListGroupsUseCase';

export interface ListGroupsUseCase
	extends UseCase<ListGroupsCommand, Promise<Pagination<GetGroupDto>>> {}

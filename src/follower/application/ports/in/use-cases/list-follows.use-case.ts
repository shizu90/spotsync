import { UseCase } from 'src/common/common.use-case';
import { Pagination } from 'src/common/common.repository';
import { ListFollowsCommand } from '../commands/list-follows.command';
import { GetFollowDto } from '../../out/dto/get-follow.dto';

export const ListFollowsUseCaseProvider = 'ListFollowsUseCase';

export interface ListFollowsUseCase
	extends UseCase<ListFollowsCommand, Promise<Pagination<GetFollowDto>>> {}

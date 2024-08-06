import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetFollowDto } from '../../out/dto/get-follow.dto';
import { ListFollowsCommand } from '../commands/list-follows.command';

export const ListFollowsUseCaseProvider = 'ListFollowsUseCase';

export interface ListFollowsUseCase
	extends UseCase<ListFollowsCommand, Promise<Pagination<GetFollowDto>>> {}

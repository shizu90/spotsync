import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetFollowRequestDto } from '../../out/dto/get-follow-request.dto';
import { ListFollowRequestsCommand } from '../commands/list-follow-requests.command';

export const ListFollowRequestsUseCaseProvider = 'ListFollowRequestsUseCase';

export interface ListFollowRequestsUseCase
	extends UseCase<
		ListFollowRequestsCommand,
		Promise<Pagination<GetFollowRequestDto>>
	> {}

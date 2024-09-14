import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetGroupRequestDto } from '../../out/dto/get-group-request.dto';
import { ListGroupRequestsCommand } from '../commands/list-group-requests.command';

export const ListGroupRequestsUseCaseProvider = 'ListGroupRequestsUseCase';

export interface ListGroupRequestsUseCase
	extends UseCase<
		ListGroupRequestsCommand,
		Promise<Pagination<GetGroupRequestDto> | Array<GetGroupRequestDto>>
	> {}

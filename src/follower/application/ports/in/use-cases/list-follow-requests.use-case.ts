import { UseCase } from 'src/common/common.use-case';
import { ListFollowRequestsCommand } from '../commands/list-follow-requests.command';
import { Pagination } from 'src/common/common.repository';
import { GetFollowRequestDto } from '../../out/dto/get-follow-request.dto';

export const ListFollowRequestsUseCaseProvider = 'ListFollowRequestsUseCase';

export interface ListFollowRequestsUseCase
  extends UseCase<
    ListFollowRequestsCommand,
    Promise<Pagination<GetFollowRequestDto>>
  > {}

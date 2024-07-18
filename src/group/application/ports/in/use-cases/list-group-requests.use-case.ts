import { UseCase } from 'src/common/common.use-case';
import { ListGroupRequestsCommand } from '../commands/list-group-requests.command';
import { GetGroupRequestDto } from '../../out/dto/get-group-request.dto';
import { Pagination } from 'src/common/common.repository';

export const ListGroupRequestsUseCaseProvider = 'ListGroupRequestsUseCase';

export interface ListGroupRequestsUseCase
  extends UseCase<
    ListGroupRequestsCommand,
    Promise<Pagination<GetGroupRequestDto>>
  > {}

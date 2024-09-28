import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GroupLogDto } from '../../out/dto/group-log.dto';
import { GetGroupHistoryCommand } from '../commands/get-group-history.command';

export const GetGroupHistoryUseCaseProvider = 'GetGroupHistoryUseCase';

export interface GetGroupHistoryUseCase
	extends UseCase<
		GetGroupHistoryCommand,
		Promise<Pagination<GroupLogDto> | Array<GroupLogDto>>
	> {}

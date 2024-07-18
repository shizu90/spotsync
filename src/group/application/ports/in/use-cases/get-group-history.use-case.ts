import { UseCase } from 'src/common/common.use-case';
import { GetGroupHistoryCommand } from '../commands/get-group-history.command';
import { GetGroupLogDto } from '../../out/dto/get-group-log.dto';
import { Pagination } from 'src/common/common.repository';

export const GetGroupHistoryUseCaseProvider = 'GetGroupHistoryUseCase';

export interface GetGroupHistoryUseCase
	extends UseCase<
		GetGroupHistoryCommand,
		Promise<Pagination<GetGroupLogDto>>
	> {}

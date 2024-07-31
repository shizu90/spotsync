import { Pagination } from 'src/common/common.repository';
import { UseCase } from 'src/common/common.use-case';
import { GetPostDto } from '../../out/dto/get-post.dto';
import { ListThreadsCommand } from '../commands/list-threads.command';

export const ListThreadsUseCaseProvider = 'ListThreadsUseCase';

export interface ListThreadsUseCase
	extends UseCase<ListThreadsCommand, Promise<Pagination<GetPostDto>>> {}

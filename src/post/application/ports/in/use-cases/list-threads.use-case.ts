import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { PostDto } from '../../out/dto/post.dto';
import { ListThreadsCommand } from '../commands/list-threads.command';

export const ListThreadsUseCaseProvider = 'ListThreadsUseCase';

export interface ListThreadsUseCase
	extends UseCase<ListThreadsCommand, Promise<Pagination<PostDto> | Array<PostDto>>> {}

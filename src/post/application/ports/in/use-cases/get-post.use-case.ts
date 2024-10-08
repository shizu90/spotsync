import { UseCase } from 'src/common/core/common.use-case';
import { PostDto } from '../../out/dto/post.dto';
import { GetPostCommand } from '../commands/get-post.command';

export const GetPostUseCaseProvider = 'GetPostUseCase';

export interface GetPostUseCase
	extends UseCase<GetPostCommand, Promise<PostDto>> {}

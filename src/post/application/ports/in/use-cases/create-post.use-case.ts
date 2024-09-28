import { UseCase } from 'src/common/core/common.use-case';
import { PostDto } from '../../out/dto/post.dto';
import { CreatePostCommand } from '../commands/create-post.command';

export const CreatePostUseCaseProvider = 'CreatePostUseCase';

export interface CreatePostUseCase
	extends UseCase<CreatePostCommand, Promise<PostDto>> {}

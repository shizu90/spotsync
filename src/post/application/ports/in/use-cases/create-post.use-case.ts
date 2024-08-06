import { UseCase } from 'src/common/core/common.use-case';
import { CreatePostDto } from '../../out/dto/create-post.dto';
import { CreatePostCommand } from '../commands/create-post.command';

export const CreatePostUseCaseProvider = 'CreatePostUseCase';

export interface CreatePostUseCase
	extends UseCase<CreatePostCommand, Promise<CreatePostDto>> {}

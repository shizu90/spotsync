import { UseCase } from 'src/common/core/common.use-case';
import { GetPostDto } from '../../out/dto/get-post.dto';
import { GetPostCommand } from '../commands/get-post.command';

export const GetPostUseCaseProvider = 'GetPostUseCase';

export interface GetPostUseCase
	extends UseCase<GetPostCommand, Promise<GetPostDto>> {}

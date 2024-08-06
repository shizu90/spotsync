import { UseCase } from 'src/common/core/common.use-case';
import { UpdatePostCommand } from '../commands/update-post.command';

export const UpdatePostUseCaseProvider = 'UpdatePostUseCase';

export interface UpdatePostUseCase
	extends UseCase<UpdatePostCommand, Promise<void>> {}

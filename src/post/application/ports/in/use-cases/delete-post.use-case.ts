import { UseCase } from 'src/common/common.use-case';
import { DeletePostCommand } from '../commands/delete-post.command';

export const DeletePostUseCaseProvider = 'DeletePostUseCase';

export interface DeletePostUseCase
	extends UseCase<DeletePostCommand, Promise<void>> {}

import { UseCase } from 'src/common/core/common.use-case';
import { DeleteGroupCommand } from '../commands/delete-group.command';

export const DeleteGroupUseCaseProvider = 'DeleteGroupUseCase';

export interface DeleteGroupUseCase
	extends UseCase<DeleteGroupCommand, Promise<void>> {}

import { UseCase } from 'src/common/core/common.use-case';
import { UpdateGroupCommand } from '../commands/update-group.command';

export const UpdateGroupUseCaseProvider = 'UpdateGroupUseCase';

export interface UpdateGroupUseCase
	extends UseCase<UpdateGroupCommand, Promise<void>> {}

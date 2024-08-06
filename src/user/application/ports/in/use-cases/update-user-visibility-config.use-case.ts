import { UseCase } from 'src/common/core/common.use-case';
import { UpdateUserVisibilityConfigCommand } from '../commands/update-user-visibility-config.command';

export const UpdateUserVisibilityConfigUseCaseProvider =
	'UpdateUserVisibilityConfigUseCase';

export interface UpdateUserVisibilityConfigUseCase
	extends UseCase<UpdateUserVisibilityConfigCommand, Promise<void>> {}

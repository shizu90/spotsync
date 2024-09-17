import { UseCase } from 'src/common/core/common.use-case';
import { UpdateUserVisibilitySettingsCommand } from '../commands/update-user-visibility-settings.command';

export const UpdateUserVisibilitySettingsUseCaseProvider =
	'UpdateUserVisibilitySettingsUseCase';

export interface UpdateUserVisibilitySettingsUseCase
	extends UseCase<UpdateUserVisibilitySettingsCommand, Promise<void>> {}

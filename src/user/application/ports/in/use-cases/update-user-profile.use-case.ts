import { UseCase } from 'src/common/core/common.use-case';
import { UpdateUserProfileCommand } from '../commands/update-user-profile.command';

export const UpdateUserProfileUseCaseProvider = 'UpdateUserProfileUseCase';

export interface UpdateUserProfileUseCase
	extends UseCase<UpdateUserProfileCommand, Promise<void>> {}

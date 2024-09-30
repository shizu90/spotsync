import { UseCase } from 'src/common/core/common.use-case';
import { ChangePasswordCommand } from '../commands/change-password.command';

export const ChangePasswordUseCaseProvider = 'ChangePasswordUseCase';

export interface ChangePasswordUseCase
	extends UseCase<ChangePasswordCommand, Promise<void>> {}

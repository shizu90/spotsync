import { UseCase } from 'src/common/core/common.use-case';
import { DeleteUserCommand } from '../commands/delete-user.command';

export const DeleteUserUseCaseProvider = 'DeleteUserUseCase';

export interface DeleteUserUseCase
	extends UseCase<DeleteUserCommand, Promise<void>> {}

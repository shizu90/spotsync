import { UseCase } from 'src/common/common.use-case';
import { DeleteUserCommand } from '../commands/delete-user.command';

export const DeleteUserUseCaseProvider = 'DeleteUserUseCase';

export interface DeleteUserUseCase
  extends UseCase<DeleteUserCommand, Promise<void>> {}

import { UseCase } from 'src/common/core/common.use-case';
import { UpdateUserCredentialsCommand } from '../commands/update-user-credentials.command';

export const UpdateUserCredentialsUseCaseProvider =
	'UpdateUserCredentialsUseCase';

export interface UpdateUserCredentialsUseCase
	extends UseCase<UpdateUserCredentialsCommand, Promise<void>> {}

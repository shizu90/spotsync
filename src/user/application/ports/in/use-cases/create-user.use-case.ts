import { UseCase } from 'src/common/core/common.use-case';
import { UserDto } from '../../out/dto/user.dto';
import { CreateUserCommand } from '../commands/create-user.command';

export const CreateUserUseCaseProvider = 'CreateUserUseCaseProvider';

export interface CreateUserUseCase
	extends UseCase<CreateUserCommand, Promise<UserDto>> {}

import { UseCase } from 'src/common/core/common.use-case';
import { CreateUserDto } from '../../out/dto/create-user.dto';
import { CreateUserCommand } from '../commands/create-user.command';

export const CreateUserUseCaseProvider = 'CreateUserUseCaseProvider';

export interface CreateUserUseCase
	extends UseCase<CreateUserCommand, Promise<CreateUserDto>> {}

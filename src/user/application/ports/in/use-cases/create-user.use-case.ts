import { CreateUserCommand } from '../commands/create-user.command';
import { UseCase } from 'src/common/common.use-case';
import { CreateUserDto } from '../../out/dto/create-user.dto';

export const CreateUserUseCaseProvider = 'CreateUserUseCaseProvider';

export interface CreateUserUseCase
	extends UseCase<CreateUserCommand, Promise<CreateUserDto>> {}

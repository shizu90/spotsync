import { UseCase } from 'src/common/core/common.use-case';
import { UserDto } from '../../out/dto/user.dto';
import { GetUserCommand } from '../commands/get-user.command';

export const GetUserUseCaseProvider = 'GetUserUseCase';

export interface GetUserUseCase
	extends UseCase<GetUserCommand, Promise<UserDto>> {}

import { UseCase } from 'src/common/core/common.use-case';
import { UserAddressDto } from '../../out/dto/user-address.dto';
import { CreateUserAddressCommand } from '../commands/create-user-address.command';

export const CreateUserAddressUseCaseProvider = 'CreateUserAddressUseCase';

export interface CreateUserAddressUseCase
	extends UseCase<CreateUserAddressCommand, Promise<UserAddressDto>> {}

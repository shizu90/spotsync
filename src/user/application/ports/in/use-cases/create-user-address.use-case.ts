import { UseCase } from 'src/common/core/common.use-case';
import { CreateUserAddressDto } from '../../out/dto/create-user-address.dto';
import { CreateUserAddressCommand } from '../commands/create-user-address.command';

export const CreateUserAddressUseCaseProvider = 'CreateUserAddressUseCase';

export interface CreateUserAddressUseCase
	extends UseCase<CreateUserAddressCommand, Promise<CreateUserAddressDto>> {}

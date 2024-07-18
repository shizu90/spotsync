import { UseCase } from 'src/common/common.use-case';
import { CreateUserAddressCommand } from '../commands/create-user-address.command';
import { CreateUserAddressDto } from '../../out/dto/create-user-address.dto';

export const CreateUserAddressUseCaseProvider = 'CreateUserAddressUseCase';

export interface CreateUserAddressUseCase
  extends UseCase<CreateUserAddressCommand, Promise<CreateUserAddressDto>> {}

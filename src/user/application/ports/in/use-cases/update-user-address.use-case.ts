import { UseCase } from 'src/common/common.use-case';
import { UpdateUserAddressCommand } from '../commands/update-user-address.command';

export const UpdateUserAddressUseCaseProvider = 'UpdateUserAddressUseCase';

export interface UpdateUserAddressUseCase
	extends UseCase<UpdateUserAddressCommand, Promise<void>> {}

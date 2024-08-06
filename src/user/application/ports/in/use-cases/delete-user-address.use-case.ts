import { UseCase } from 'src/common/core/common.use-case';
import { DeleteUserAddressCommand } from '../commands/delete-user-address.command';

export const DeleteUserAddressUseCaseProvider = 'DeleteUserAddressUseCase';

export interface DeleteUserAddressUseCase
	extends UseCase<DeleteUserAddressCommand, Promise<void>> {}

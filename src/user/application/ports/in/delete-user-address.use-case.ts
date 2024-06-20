import { UseCase } from "src/common/common.use-case";
import { DeleteUserAddressCommand } from "./delete-user-address.command";

export const DeleteUserAddressUseCaseProvider = 'DeleteUserAddressUseCase';

export interface DeleteUserAddressUseCase extends UseCase<DeleteUserAddressCommand, Promise<void>> 
{}
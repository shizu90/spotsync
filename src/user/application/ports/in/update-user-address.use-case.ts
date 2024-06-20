import { UseCase } from "src/common/common.use-case";
import { UpdateUserAddressCommand } from "./update-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";

export const UpdateUserAddressUseCaseProvider = 'UpdateUserAddressUseCase';

export interface UpdateUserAddressUseCase extends UseCase<UpdateUserAddressCommand, Promise<UserAddress>> 
{} 
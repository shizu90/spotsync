import { UseCase } from "src/common/common.use-case";
import { UpdateUserrAddressCommand } from "./update-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";

export interface UpdateUserAddressUseCase extends UseCase<UpdateUserrAddressCommand, Promise<UserAddress>> 
{} 
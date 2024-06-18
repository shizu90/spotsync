import { UseCase } from "src/common/common.use-case";
import { CreateUserAddressCommand } from "./create-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";

export interface CreateUserAddressUseCase extends UseCase<CreateUserAddressCommand, Promise<UserAddress>> 
{}
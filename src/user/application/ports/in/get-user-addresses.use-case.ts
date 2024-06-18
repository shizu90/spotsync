import { UseCase } from "src/common/common.use-case";
import { GetUserAddressessCommand } from "./get-user-addresses.command";
import { Pagination } from "src/common/pagination.dto";
import { UserAddress } from "src/user/domain/user-address.model";

export interface GetUserAddressessUseCase extends UseCase<GetUserAddressessCommand, Promise<Pagination<UserAddress>>> 
{}
import { UseCase } from "src/common/common.use-case";
import { GetUserAddressesCommand } from "./get-user-addresses.command";
import { Pagination } from "src/common/pagination.dto";
import { UserAddress } from "src/user/domain/user-address.model";

export const GetUserAddressesUseCaseProvider = 'GetUserAddressesUseCase';

export interface GetUserAddressesUseCase extends UseCase<GetUserAddressesCommand, Promise<Pagination<UserAddress>>> 
{}
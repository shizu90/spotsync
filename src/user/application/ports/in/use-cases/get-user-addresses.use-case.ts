import { UseCase } from "src/common/common.use-case";
import { GetUserAddressesCommand } from "../commands/get-user-addresses.command";
import { Pagination } from "src/common/pagination.dto";
import { UserAddress } from "src/user/domain/user-address.model";
import { GetUserAddressDto } from "../../out/dto/get-user-address.dto";

export const GetUserAddressesUseCaseProvider = 'GetUserAddressesUseCase';

export interface GetUserAddressesUseCase extends UseCase<GetUserAddressesCommand, Promise<Pagination<GetUserAddressDto> | Array<GetUserAddressDto>>> 
{}
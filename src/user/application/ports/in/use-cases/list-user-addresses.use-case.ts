import { UseCase } from "src/common/common.use-case";
import { ListUserAddressesCommand } from "../commands/list-user-addresses.command";
import { GetUserAddressDto } from "../../out/dto/get-user-address.dto";
import { Pagination } from "src/common/pagination.dto";

export const ListUserAddressesUseCaseProvider = 'ListUserAddressesUseCase';

export interface ListUserAddressesUseCase extends UseCase<ListUserAddressesCommand, Promise<Array<GetUserAddressDto> | Pagination<GetUserAddressDto>>> 
{}
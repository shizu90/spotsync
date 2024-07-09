import { UseCase } from "src/common/common.use-case";
import { GetUserAddressesCommand } from "../commands/get-user-addresses.command";
import { GetUserAddressDto } from "../../out/dto/get-user-address.dto";

export const GetUserAddressesUseCaseProvider = 'GetUserAddressesUseCase';

export interface GetUserAddressesUseCase extends UseCase<GetUserAddressesCommand, Promise<Array<GetUserAddressDto>>> 
{}
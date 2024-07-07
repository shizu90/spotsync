import { UseCase } from "src/common/common.use-case";
import { GetUserAddressCommand } from "../commands/get-user-address.command";
import { GetUserAddressDto } from "../../out/dto/get-user-address.dto";

export const GetUserAddressUseCaseProvider = 'GetUserAddressUseCase';

export interface GetUserAddressUseCase extends UseCase<GetUserAddressCommand, Promise<GetUserAddressDto>>
{}
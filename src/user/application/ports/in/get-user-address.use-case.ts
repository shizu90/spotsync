import { UseCase } from "src/common/common.use-case";
import { GetUserAddressCommand } from "./get-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";

export const GetUserAddressUseCaseProvider = 'GetUserAddressUseCase';

export interface GetUserAddressUseCase extends UseCase<GetUserAddressCommand, Promise<UserAddress>>
{}
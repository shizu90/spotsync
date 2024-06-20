import { Inject, Injectable } from "@nestjs/common";
import { GetUserAddressUseCase } from "../ports/in/get-user-address.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { GetUserAddressCommand } from "../ports/in/get-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Injectable()
export class GetUserAddressService implements GetUserAddressUseCase 
{
    constructor(
        @Inject(UserAddressRepositoryProvider) 
        protected userAddressRepository: UserAddressRepository,
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: GetUserAddressCommand): Promise<UserAddress> 
    {
        const user: User = this.userRepository.findById(command.userId);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.userId} not found.`);
        }

        const userAddress: UserAddress = this.userAddressRepository.findById(command.id);

        if(userAddress == null || userAddress.user().id() != user.id()) {
            throw new UserNotFoundError(`User address ${command.id} not found.`);
        }

        return userAddress;
    }
}
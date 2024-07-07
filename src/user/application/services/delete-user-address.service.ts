import { Inject, Injectable } from "@nestjs/common";
import { DeleteUserAddressUseCase } from "../ports/in/use-cases/delete-user-address.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { DeleteUserAddressCommand } from "../ports/in/commands/delete-user-address.command";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAddress } from "src/user/domain/user-address.model";
import { UserAddressNotFoundError } from "./errors/user-address-not-found.error";

@Injectable()
export class DeleteUserAddressService implements DeleteUserAddressUseCase 
{
    constructor(
        @Inject(UserAddressRepositoryProvider) 
        protected userAddressRepository: UserAddressRepository,
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: DeleteUserAddressCommand): Promise<void> 
    {
        const user: User = await this.userRepository.findById(command.userId);
        
        if(user == null) {
            throw new UserNotFoundError(`User ${command.userId} not found.`);
        }

        const userAddress: UserAddress = await this.userAddressRepository.findById(command.id);

        if(userAddress == null || userAddress.isDeleted() || userAddress.user().id() != user.id()) {
            throw new UserAddressNotFoundError(`User address ${command.id} not found.`);
        }

        userAddress.delete();

        this.userAddressRepository.update(userAddress);
    
        return null;
    }
}
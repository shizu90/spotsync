import { User } from "src/user/domain/user.model";
import { DeleteUserCommand } from "../ports/in/commands/delete-user.command";
import { DeleteUserUseCase } from "../ports/in/use-cases/delete-user.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { Inject, Injectable } from "@nestjs/common";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";

@Injectable()
export class DeleteUserService implements DeleteUserUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository,
        @Inject(UserAddressRepositoryProvider)
        protected userAddressRepository: UserAddressRepository
    )
    {}

    public async execute(command: DeleteUserCommand): Promise<void> 
    {
        const user: User = await this.userRepository.findById(command.id);

        if(user == null || user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.id} not found.`);
        }

        const userAddresses = await this.userAddressRepository.findBy({userId: user.id()});

        userAddresses.forEach((userAddress) => {
            userAddress.delete();
            this.userAddressRepository.update(userAddress);
        });

        user.delete();
        
        await this.userRepository.update(user);
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { GetUserAddressesUseCase } from "../ports/in/get-user-addresses.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { GetUserAddressesCommand } from "../ports/in/get-user-addresses.command";
import { Pagination } from "src/common/pagination.dto";
import { UserAddress } from "src/user/domain/user-address.model";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Injectable()
export class GetUserAddressesService implements GetUserAddressesUseCase 
{
    constructor(
        @Inject(UserAddressRepositoryProvider) 
        protected userAddressRepository: UserAddressRepository,
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: GetUserAddressesCommand): Promise<Pagination<UserAddress>> 
    {
        const user: User = this.userRepository.findById(command.userId);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.userId} not found.`);
        }

        return this.userAddressRepository.findByUserId(user.id());
    }
}
import { Injectable } from "@nestjs/common";
import { CreateUserAddressUseCase } from "../ports/in/create-user-address.use-case";
import { UserAddressRepository } from "../ports/out/user-address.repository";
import { CreateUserAddressCommand } from "../ports/in/create-user-address.command";
import { UserRepository } from "../ports/out/user.repository";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAddress } from "src/user/domain/user-address.model";
import { randomUUID } from "crypto";

@Injectable()
export class CreateUserAddressService implements CreateUserAddressUseCase 
{
    constructor(
        protected userAddressRepository: UserAddressRepository,
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: CreateUserAddressCommand): Promise<UserAddress> 
    {
        const user: User = this.userRepository.findById(command.userId);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.userId} not found.`);
        }

        const userAddress: UserAddress = UserAddress.create(
            randomUUID(),
            command.name,
            command.area,
            command.subArea,
            command.locality,
            null,
            null,
            command.countryCode,
            command.main,
            user
        );

        if(userAddress.main()) {
            const mainAddresses: Array<UserAddress> = this.userAddressRepository.findByUserIdAndMain(user.id(), userAddress.main());

            mainAddresses.forEach((userAddress: UserAddress) => {
                userAddress.changeMain(false);
                this.userAddressRepository.update(userAddress);
            });
        }

        return this.userAddressRepository.store(userAddress);
    }
}
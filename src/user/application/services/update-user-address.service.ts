import { Injectable } from "@nestjs/common";
import { UpdateUserAddressUseCase } from "../ports/in/update-user-address.use-case";
import { UserAddressRepository } from "../ports/out/user-address.repository";
import { UserRepository } from "../ports/out/user.repository";
import { UpdateUserAddressCommand } from "../ports/in/update-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAddressNotFoundError } from "./errors/user-address-not-found.error";

@Injectable()
export class UpdateUserAddressService implements UpdateUserAddressUseCase 
{
    constructor(
        protected userAddressRepository: UserAddressRepository,
        protected userRepository: UserRepository
    )
    {}

    public async execute(command: UpdateUserAddressCommand): Promise<UserAddress> 
    {
        const user: User = this.userRepository.findById(command.userId);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.userId} not found.`);
        }

        const userAddress: UserAddress = this.userAddressRepository.findById(command.id);

        if(userAddress == null || userAddress.user().id() != user.id()) {
            throw new UserAddressNotFoundError(`User address ${command.id} not found.`);
        }

        if(command.area != null) {
            userAddress.changeArea(command.area);
        }

        if(command.countryCode != null) {
            userAddress.changeCountryCode(command.countryCode);
        }

        if(command.locality != null) {
            userAddress.changeLocality(command.locality);
        }

        if(command.subArea != null) {
            userAddress.changeSubArea(command.subArea);
        }

        if(command.main != null) {
            if(command.main) {
                const userMainAddresses: Array<UserAddress> = this.userAddressRepository.findByUserIdAndMain(command.userId, true);

                userMainAddresses.forEach((userAddress: UserAddress) => {
                    userAddress.changeMain(false);

                    this.userAddressRepository.update(userAddress);
                });
            }

            userAddress.changeMain(command.main);
        }

        return this.userAddressRepository.update(userAddress);
    }
}
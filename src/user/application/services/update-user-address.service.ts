import { Inject, Injectable } from "@nestjs/common";
import { UpdateUserAddressUseCase } from "../ports/in/use-cases/update-user-address.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UpdateUserAddressCommand } from "../ports/in/commands/update-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAddressNotFoundError } from "./errors/user-address-not-found.error";
import { GeoLocatorInput, GeoLocatorOutput, GeoLocatorService, GeoLocatorServiceProvider } from "../ports/out/geo-locator.service";

@Injectable()
export class UpdateUserAddressService implements UpdateUserAddressUseCase 
{
    constructor(
        @Inject(UserAddressRepositoryProvider) 
        protected userAddressRepository: UserAddressRepository,
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository,
        @Inject(GeoLocatorServiceProvider) 
        protected geoLocatorService: GeoLocatorService
    )
    {}

    public async execute(command: UpdateUserAddressCommand): Promise<void> 
    {
        const user: User = await this.userRepository.findById(command.userId);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.userId} not found.`);
        }

        const userAddress: UserAddress = await this.userAddressRepository.findById(command.id);

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

        const coordinates: GeoLocatorOutput = this.geoLocatorService.getCoordinates(
            new GeoLocatorInput(
                userAddress.area(),
                userAddress.subArea(),
                userAddress.locality(),
                userAddress.countryCode()
            )
        );

        userAddress.changeLatitude(coordinates.latitude);
        userAddress.changeLongitude(coordinates.longitude);

        if(command.main != null) {
            if(command.main) {
                const userMainAddresses: Array<UserAddress> = await this.userAddressRepository.findBy(
                    {userId: user.id(), main: true}
                );

                userMainAddresses.forEach((userAddress: UserAddress) => {
                    userAddress.changeMain(false);

                    this.userAddressRepository.update(userAddress);
                });
            }

            userAddress.changeMain(command.main);
        }
    }
}
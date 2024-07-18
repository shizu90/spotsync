import { Inject, Injectable } from "@nestjs/common";
import { UpdateUserAddressUseCase } from "../ports/in/use-cases/update-user-address.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UpdateUserAddressCommand } from "../ports/in/commands/update-user-address.command";
import { UserAddress } from "src/user/domain/user-address.model";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAddressNotFoundError } from "./errors/user-address-not-found.error";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { Geolocator, GeoLocatorInput, GeoLocatorOutput, GeoLocatorProvider } from "src/geolocation/geolocator";

@Injectable()
export class UpdateUserAddressService implements UpdateUserAddressUseCase 
{
    constructor(
        @Inject(UserAddressRepositoryProvider) 
        protected userAddressRepository: UserAddressRepository,
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository,
        @Inject(GeoLocatorProvider) 
        protected geoLocatorService: Geolocator,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    )
    {}

    public async execute(command: UpdateUserAddressCommand): Promise<void> 
    {
        const user: User = await this.userRepository.findById(command.userId);

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        if(user.id() !== this.getAuthenticatedUser.execute(null)) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        const userAddress: UserAddress = await this.userAddressRepository.findById(command.id);

        if(userAddress === null || userAddress === undefined || userAddress.user().id() !== user.id() || userAddress.isDeleted()) {
            throw new UserAddressNotFoundError(`User address not found`);
        }

        if(command.name && command.name !== null && command.name.length > 0) {
            userAddress.changeName(command.name);
        }

        if(command.area && command.area !== null && command.area.length > 0) {
            userAddress.changeArea(command.area);
        }

        if(command.countryCode && command.countryCode !== null && command.countryCode.length > 0) {
            userAddress.changeCountryCode(command.countryCode);
        }

        if(command.locality && command.locality !== null && command.locality.length > 0) {
            userAddress.changeLocality(command.locality);
        }

        if(command.subArea && command.subArea !== null && command.subArea.length > 0) {
            userAddress.changeSubArea(command.subArea);
        }

        const coordinates: GeoLocatorOutput = await this.geoLocatorService.coordinates(
            new GeoLocatorInput(
                userAddress.area(),
                userAddress.subArea(),
                userAddress.locality(),
                userAddress.countryCode()
            )
        );

        userAddress.changeLatitude(coordinates.latitude);
        userAddress.changeLongitude(coordinates.longitude);

        if(command.main && command.main !== null) {
            if(command.main === true) {
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

        this.userAddressRepository.update(userAddress);
    }
}
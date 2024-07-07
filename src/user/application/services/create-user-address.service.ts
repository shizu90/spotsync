import { Inject, Injectable } from "@nestjs/common";
import { CreateUserAddressUseCase } from "../ports/in/use-cases/create-user-address.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { CreateUserAddressCommand } from "../ports/in/commands/create-user-address.command";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { UserAddress } from "src/user/domain/user-address.model";
import { randomUUID } from "crypto";
import { GeoLocatorInput, GeoLocatorOutput, GeoLocatorService, GeoLocatorServiceProvider } from "../ports/out/geo-locator.service";
import { CreateUserAddressDto } from "../ports/out/dto/create-user-address.dto";

@Injectable()
export class CreateUserAddressService implements CreateUserAddressUseCase 
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

    public async execute(command: CreateUserAddressCommand): Promise<CreateUserAddressDto> 
    {
        const user: User = await this.userRepository.findById(command.userId);

        if(user == null) {
            throw new UserNotFoundError(`User ${command.userId} not found.`);
        }

        const coordinates: GeoLocatorOutput = this.geoLocatorService.getCoordinates(
            new GeoLocatorInput(
                command.area,
                command.subArea,
                command.locality,
                command.countryCode
            )
        );

        const userAddress: UserAddress = UserAddress.create(
            randomUUID(),
            command.name,
            command.area,
            command.subArea,
            command.locality,
            coordinates.latitude,
            coordinates.longitude,
            command.countryCode,
            command.main,
            user
        );

        if(userAddress.main()) {
            const mainAddresses: Array<UserAddress> = await this.userAddressRepository.findBy(
                {userId: user.id(), main: true}
            );

            mainAddresses.forEach((userAddress: UserAddress) => {
                userAddress.changeMain(false);
                this.userAddressRepository.update(userAddress);
            });
        }

        await this.userAddressRepository.store(userAddress);

        return new CreateUserAddressDto(
            userAddress.id(),
            userAddress.name(),
            userAddress.area(),
            userAddress.subArea(),
            userAddress.locality(),
            userAddress.countryCode(),
            userAddress.latitude(),
            userAddress.longitude(),
            userAddress.main(),
            userAddress.createdAt(),
            userAddress.updatedAt()
        );
    }
}
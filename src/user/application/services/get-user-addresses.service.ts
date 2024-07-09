import { Inject, Injectable } from "@nestjs/common";
import { GetUserAddressesUseCase } from "../ports/in/use-cases/get-user-addresses.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { GetUserAddressesCommand } from "../ports/in/commands/get-user-addresses.command";
import { Pagination } from "src/common/pagination.dto";
import { User } from "src/user/domain/user.model";
import { UserNotFoundError } from "./errors/user-not-found.error";
import { GetUserAddressDto } from "../ports/out/dto/get-user-address.dto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class GetUserAddressesService implements GetUserAddressesUseCase 
{
    constructor(
        @Inject(UserAddressRepositoryProvider) 
        protected userAddressRepository: UserAddressRepository,
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: GetUserAddressesCommand): Promise<Array<GetUserAddressDto>> 
    {
        const user: User = await this.userRepository.findById(command.userId);

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User ${command.userId} not found`);
        }

        if(user.id() !== this.getAuthenticatedUser.execute(null)) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        const userAddresses = await this.userAddressRepository.findBy({userId: user.id(), isDeleted: false});

        return userAddresses.map((userAddress) => {
            return new GetUserAddressDto(
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
        });
    }
}
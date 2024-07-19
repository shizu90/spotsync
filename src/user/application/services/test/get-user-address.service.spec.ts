import { TestBed } from "@automock/jest";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../../ports/out/user.repository";
import { GetUserAddressService } from "../get-user-address.service";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { randomUUID } from "crypto";
import { User } from "src/user/domain/user.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { UserAddress } from "src/user/domain/user-address.model";
import { GetUserAddressCommand } from "../../ports/in/commands/get-user-address.command";
import { UserAddressNotFoundError } from "../errors/user-address-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";

const command = new GetUserAddressCommand(
    randomUUID(),
    randomUUID()
);

const mockUser = () => {
    const id = randomUUID();

    return User.create(
        id,
        "Teste123",
        null,
        null,
        null,
        null,
        null,
        null,
        UserCredentials.create(id, null, null, null, null, null, null),
        UserVisibilityConfig.create(
            id,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC
        ),
        new Date(),
        new Date(),
        false
    );
};

const mockUserAddress = () => {
    const id = randomUUID();

    return UserAddress.create(
        id,
        "Test Address",
        "Area",
        "Sub area",
        "Locality",
        0,
        0,
        "BR",
        true,
        mockUser()
    );
}

describe('GetUserAddressService', () => {
    let service: GetUserAddressService;
    let userAddressRepository: jest.Mocked<UserAddressRepository>;
    let userRepository: jest.Mocked<UserRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(async () => {
        const { unit, unitRef } = TestBed.create(GetUserAddressService).compile();

        service = unit;
        userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get user address', async () => {
        const userAddress = mockUserAddress();

        userAddressRepository.findById.mockResolvedValue(userAddress);
        userRepository.findById.mockResolvedValue(userAddress.user());
        getAuthenticatedUser.execute.mockReturnValue(userAddress.user().id());

        const address = await service.execute(command);

        expect(address.name).toBe(userAddress.name());
    });

    it('should not get user address if user address does not exist', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);
        getAuthenticatedUser.execute.mockReturnValue(user.id());
        userAddressRepository.findById.mockResolvedValue(null);

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserAddressNotFoundError);
        });
    });

    it('should not get user address if user is not the owner', async () => {
        const userAddress = mockUserAddress();

        userRepository.findById.mockResolvedValue(userAddress.user());
        getAuthenticatedUser.execute.mockReturnValue(mockUser().id());
        userAddressRepository.findById.mockResolvedValue(userAddress);

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UnauthorizedAccessError);
        });
    });
});
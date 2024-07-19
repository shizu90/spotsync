import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../../ports/out/user-address.repository";
import { UserRepository, UserRepositoryProvider } from "../../ports/out/user.repository";
import { UpdateUserAddressService } from "../update-user-address.service";
import { TestBed } from "@automock/jest";
import { randomUUID } from "crypto";
import { User } from "src/user/domain/user.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { UserAddress } from "src/user/domain/user-address.model";
import { UpdateUserAddressCommand } from "../../ports/in/commands/update-user-address.command";
import { GeoLocatorOutput, GeoLocatorProvider, Geolocator } from "src/geolocation/geolocator";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { UserAddressNotFoundError } from "../errors/user-address-not-found.error";

const command = new UpdateUserAddressCommand(
    randomUUID(),
    randomUUID(),
    "New Address"
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
        UserCredentials.create(id, 'Test', 'test@test.test', 'Test123', null, null, null),
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
};

describe('UpdateUserAddressService', () => {
    let service: UpdateUserAddressService;
    let userAddressRepository: jest.Mocked<UserAddressRepository>;
    let userRepository: jest.Mocked<UserRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let geolocator: jest.Mocked<Geolocator>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UpdateUserAddressService).compile();

        service = unit;
        userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        geolocator = unitRef.get(GeoLocatorProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should update user address', async () => {
        const user = mockUser();
        const userAddress = mockUserAddress();

        userRepository.findById.mockResolvedValue(userAddress.user());
        userAddressRepository.findById.mockResolvedValue(userAddress);
        getAuthenticatedUser.execute.mockReturnValue(userAddress.user().id());
        geolocator.coordinates.mockResolvedValue(new GeoLocatorOutput(0, 0));

        await service.execute(command);

        expect(userAddress.name()).toBe('New Address');
    });

    it('should not update user address if user is not authenticated', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);
        getAuthenticatedUser.execute.mockReturnValue(randomUUID());

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UnauthorizedAccessError);
        });
    });

    it('should not update user address if user address does not exist', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);
        userAddressRepository.findById.mockResolvedValue(null);
        getAuthenticatedUser.execute.mockReturnValue(user.id());

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserAddressNotFoundError);
        });
    });

    it('should not update user address if user address does not belong to user', async () => {
        const user = mockUser();
        const userAddress = mockUserAddress();

        userRepository.findById.mockResolvedValue(user);
        userAddressRepository.findById.mockResolvedValue(userAddress);
        getAuthenticatedUser.execute.mockReturnValue(user.id());

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserAddressNotFoundError);
        });
    });
});
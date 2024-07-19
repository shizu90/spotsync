import { CreateUserAddressService } from "../create-user-address.service";
import { TestBed } from "@automock/jest";
import { UserRepository, UserRepositoryProvider } from "../../ports/out/user.repository";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../../ports/out/user-address.repository";
import { CreateUserAddressCommand } from "../../ports/in/commands/create-user-address.command";
import { User } from "src/user/domain/user.model";
import { randomUUID } from "crypto";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GeoLocatorOutput, GeoLocatorProvider, Geolocator } from "src/geolocation/geolocator";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";

const command = new CreateUserAddressCommand(
    randomUUID(),
    "Test Address",
    "Area",
    "Sub area",
    "Locality",
    "BR",
    true
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

describe('CreateUserAddressService', () => {
    let service: CreateUserAddressService;
    let userRepository: jest.Mocked<UserRepository>;
    let userAddressRepository: jest.Mocked<UserAddressRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let geoLocator: jest.Mocked<Geolocator>;

    beforeAll(async () => {
        const { unit, unitRef } = TestBed.create(CreateUserAddressService).compile();

        service = unit;
        userRepository = unitRef.get(UserRepositoryProvider);
        userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        geoLocator = unitRef.get(GeoLocatorProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user address', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);
        userAddressRepository.findBy.mockResolvedValue([]);
        userAddressRepository.store.mockResolvedValue(null);
        getAuthenticatedUser.execute.mockReturnValue(user.id());
        geoLocator.coordinates.mockResolvedValue(new GeoLocatorOutput(0, 0));

        const address = await service.execute(command);

        expect(address.name).toBe('Test Address');
    });

    it('should not create a user address if user does not exist', async () => {
        userRepository.findById.mockResolvedValue(null);
        getAuthenticatedUser.execute.mockReturnValue(null);

        await service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserNotFoundError);
        });
    });

    it('should not create a user address if user is not authenticated', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);
        getAuthenticatedUser.execute.mockReturnValue(randomUUID());

        await service.execute(command).catch(e => {
            expect(e.constructor).toBe(UnauthorizedAccessError);
        });
    });
});
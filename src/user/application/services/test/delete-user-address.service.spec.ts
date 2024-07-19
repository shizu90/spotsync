import { DeleteUserAddressService } from "../delete-user-address.service";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserRepository, UserRepositoryProvider } from "../../ports/out/user.repository";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../../ports/out/user-address.repository";
import { TestBed } from "@automock/jest";
import { User } from "src/user/domain/user.model";
import { randomUUID } from "crypto";
import { DeleteUserAddressCommand } from "../../ports/in/commands/delete-user-address.command";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { UserAddress } from "src/user/domain/user-address.model";
import { UserAddressNotFoundError } from "../errors/user-address-not-found.error";

const command = new DeleteUserAddressCommand(
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

describe('DeleteUserAddressService', () => {
    let service: DeleteUserAddressService;
    let userRepository: jest.Mocked<UserRepository>;
    let userAddressRepository: jest.Mocked<UserAddressRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(async () => {
        const { unit, unitRef } = TestBed.create(DeleteUserAddressService).compile();

        service = unit;
        userRepository = unitRef.get(UserRepositoryProvider);
        userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should delete a user address', async () => {
        const userAddress = mockUserAddress();

        userRepository.findById.mockResolvedValue(userAddress.user());
        getAuthenticatedUser.execute.mockReturnValue(userAddress.user().id());
        userAddressRepository.findById.mockResolvedValue(userAddress);

        const deleted = await service.execute(command);

        expect(deleted).toBeUndefined();
    });

    it('should not delete a user address that does not exist', async () => {
        const userAddress = mockUserAddress();

        userRepository.findById.mockResolvedValue(userAddress.user());
        getAuthenticatedUser.execute.mockReturnValue(userAddress.user().id());
        userAddressRepository.findById.mockResolvedValue(null);

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserAddressNotFoundError);
        });
    });

    it('should not delete a user address that does not belong to the user', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);
        getAuthenticatedUser.execute.mockReturnValue(user.id());
        userAddressRepository.findById.mockResolvedValue(mockUserAddress());

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserAddressNotFoundError);
        });
    });
});
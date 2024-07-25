import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GetUserAddressCommand } from "../../ports/in/commands/get-user-address.command";
import { GetUserAddressDto } from "../../ports/out/dto/get-user-address.dto";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../../ports/out/user-address.repository";
import { GetUserAddressService } from "../get-user-address.service";
import { mockUser, mockUserAddress } from "./user-mock.helper";

describe("GetUserAddressService", () => {
    let service: GetUserAddressService;
    let userAddressRepository: jest.Mocked<UserAddressRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(GetUserAddressService).compile();

        service = unit;
        userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should get user address', async () => {
        const userAddress = mockUserAddress();
        const user = userAddress.user();

        const command = new GetUserAddressCommand(
            userAddress.id(),
            user.id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);
        userAddressRepository.findById.mockResolvedValue(userAddress);

        const address = await service.execute(command);

        expect(address).toBeInstanceOf(GetUserAddressDto);
        expect(address.id).toBe(userAddress.id());
    });

    it('should not get user address if user is not authorized', async () => {
        const userAddress = mockUserAddress();
        const user = userAddress.user();

        const command = new GetUserAddressCommand(
            userAddress.id(),
            user.id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(mockUser());

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});
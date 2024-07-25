import { TestBed } from "@automock/jest";
import { randomUUID } from "crypto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GeoLocatorOutput, GeoLocatorProvider } from "src/geolocation/geolocator";
import { GeoLocatorService } from "src/geolocation/geolocator.service";
import { CreateUserAddressCommand } from "../../ports/in/commands/create-user-address.command";
import { CreateUserAddressDto } from "../../ports/out/dto/create-user-address.dto";
import { UserAddressRepository, UserAddressRepositoryProvider } from "../../ports/out/user-address.repository";
import { CreateUserAddressService } from "../create-user-address.service";
import { mockUser, mockUserAddress } from "./user-mock.helper";

describe("CreateUserAddressService", () => {
    let service: CreateUserAddressService;
    let userAddressRepository: jest.Mocked<UserAddressRepository>;
    let geoLocatorService: jest.Mocked<GeoLocatorService>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(CreateUserAddressService).compile();

        service = unit;
        userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
        geoLocatorService = unitRef.get(GeoLocatorProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create an user address', async () => {
        const user = mockUser();

        const command = new CreateUserAddressCommand(
            user.id(),
            'Address Name',
            'Address Area',
            'Address Sub Area',
            'Address Locality',
            'US',
            true,
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);
        geoLocatorService.coordinates.mockResolvedValue(new GeoLocatorOutput(
            0, 0
        ));
        userAddressRepository.findBy.mockResolvedValue([mockUserAddress()]);

        const address = await service.execute(command);

        expect(address).toBeInstanceOf(CreateUserAddressDto);
        expect(address.name).toBe(command.name);
        expect(address.latitude).toBe(0);
        expect(address.longitude).toBe(0);
        expect(address.main).toBe(command.main);
    });

    it('should not create an user address if user is not authorized', async () => {
        const user = mockUser();

        const command = new CreateUserAddressCommand(
            randomUUID(),
            'Address Name',
            'Address Area',
            'Address Sub Area',
            'Address Locality',
            'US',
            true,
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});
import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	GeoLocatorOutput,
	GeoLocatorProvider,
} from 'src/geolocation/geolocator';
import { GeoLocatorService } from 'src/geolocation/geolocator.service';
import { UpdateUserAddressCommand } from '../../ports/in/commands/update-user-address.command';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import { UserAddressNotFoundError } from '../errors/user-address-not-found.error';
import { UpdateUserAddressService } from '../update-user-address.service';
import { mockUser, mockUserAddress } from './user-mock.helper';

describe('UpdateUserAddressService', () => {
	let service: UpdateUserAddressService;
	let geoLocatorService: jest.Mocked<GeoLocatorService>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			UpdateUserAddressService,
		).compile();

		service = unit;
		geoLocatorService = unitRef.get(GeoLocatorProvider);
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should update user address', async () => {
		const userAddress = mockUserAddress();
		const user = userAddress.user();

		const command = new UpdateUserAddressCommand(
			userAddress.id(),
			user.id(),
			'New Address Name',
		);

		getAuthenticatedUser.execute.mockResolvedValue(user);
		geoLocatorService.coordinates.mockResolvedValue(
			new GeoLocatorOutput(0, 0),
		);
		userAddressRepository.findById.mockResolvedValue(userAddress);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(userAddress.name()).toBe(command.name);
	});

	it('should not update user address if user is not authorized', async () => {
		const userAddress = mockUserAddress();
		const user = userAddress.user();

		const command = new UpdateUserAddressCommand(
			userAddress.id(),
			user.id(),
			'New Address Name',
		);

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not update user address if it does not exist', async () => {
		const user = mockUser();

		const command = new UpdateUserAddressCommand(randomUUID(), user.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userAddressRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserAddressNotFoundError,
		);
	});
});

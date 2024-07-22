import { CreateUserAddressService } from '../create-user-address.service';
import { TestBed } from '@automock/jest';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import { CreateUserAddressCommand } from '../../ports/in/commands/create-user-address.command';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GeoLocatorOutput,
	GeoLocatorProvider,
	Geolocator,
} from 'src/geolocation/geolocator';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { mockUser, mockUserAddress } from './user-mock.helper';

describe('CreateUserAddressService', () => {
	let service: CreateUserAddressService;
	let userRepository: jest.Mocked<UserRepository>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let geoLocator: jest.Mocked<Geolocator>;

	beforeAll(async () => {
		const { unit, unitRef } = TestBed.create(
			CreateUserAddressService,
		).compile();

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
		const address = mockUserAddress();

		const command = new CreateUserAddressCommand(
			user.id(),
			address.name(),
			address.area(),
			address.subArea(),
			address.locality(),
			address.countryCode(),
			address.main(),
		);

		userRepository.findById.mockResolvedValue(user);
		userAddressRepository.findBy.mockResolvedValue([]);
		userAddressRepository.store.mockResolvedValue(address);
		getAuthenticatedUser.execute.mockReturnValue(user.id());
		geoLocator.coordinates.mockResolvedValue(new GeoLocatorOutput(0, 0));

		const response = await service.execute(command);

		expect(response.name).toBe(address.name());
	});

	it('should not create a user address if user does not exist', async () => {
		const user = mockUser();
		const address = mockUserAddress();

		const command = new CreateUserAddressCommand(
			user.id(),
			address.name(),
			address.area(),
			address.subArea(),
			address.locality(),
			address.countryCode(),
			address.main(),
		);

		userRepository.findById.mockResolvedValue(null);
		getAuthenticatedUser.execute.mockReturnValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});

	it('should not create a user address if user is not authenticated', async () => {
		const user = mockUser();
		const address = mockUserAddress();

		const command = new CreateUserAddressCommand(
			user.id(),
			address.name(),
			address.area(),
			address.subArea(),
			address.locality(),
			address.countryCode(),
			address.main(),
		);

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

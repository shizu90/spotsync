import { TestBed } from '@automock/jest';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { GetUserAddressService } from '../get-user-address.service';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UserAddressNotFoundError } from '../errors/user-address-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { mockUser, mockUserAddress } from './user-mock.helper';
import { GetUserAddressCommand } from '../../ports/in/commands/get-user-address.command';
import { randomUUID } from 'crypto';

describe('GetUserAddressService', () => {
	let service: GetUserAddressService;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(async () => {
		const { unit, unitRef } = TestBed.create(
			GetUserAddressService,
		).compile();

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

		const command = new GetUserAddressCommand(randomUUID(), randomUUID());

		userAddressRepository.findById.mockResolvedValue(userAddress);
		userRepository.findById.mockResolvedValue(userAddress.user());
		getAuthenticatedUser.execute.mockReturnValue(userAddress.user().id());

		const address = await service.execute(command);

		expect(address.name).toBe(userAddress.name());
	});

	it('should not get user address if user address does not exist', async () => {
		const user = mockUser();

		const command = new GetUserAddressCommand(randomUUID(), randomUUID());

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());
		userAddressRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserAddressNotFoundError,
		);
	});

	it('should not get user address if user is not the owner', async () => {
		const userAddress = mockUserAddress();

		const command = new GetUserAddressCommand(randomUUID(), randomUUID());

		userRepository.findById.mockResolvedValue(userAddress.user());
		getAuthenticatedUser.execute.mockReturnValue(mockUser().id());
		userAddressRepository.findById.mockResolvedValue(userAddress);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

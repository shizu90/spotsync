import { DeleteUserAddressService } from '../delete-user-address.service';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import { TestBed } from '@automock/jest';
import { UserAddressNotFoundError } from '../errors/user-address-not-found.error';
import { mockUser, mockUserAddress } from './user-mock.helper';
import { randomUUID } from 'crypto';
import { DeleteUserAddressCommand } from '../../ports/in/commands/delete-user-address.command';

describe('DeleteUserAddressService', () => {
	let service: DeleteUserAddressService;
	let userRepository: jest.Mocked<UserRepository>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(async () => {
		const { unit, unitRef } = TestBed.create(
			DeleteUserAddressService,
		).compile();

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

		const command = new DeleteUserAddressCommand(randomUUID(), randomUUID());

		userRepository.findById.mockResolvedValue(userAddress.user());
		getAuthenticatedUser.execute.mockReturnValue(userAddress.user().id());
		userAddressRepository.findById.mockResolvedValue(userAddress);

		const deleted = await service.execute(command);

		expect(deleted).toBeUndefined();
	});

	it('should not delete a user address that does not exist', async () => {
		const userAddress = mockUserAddress();

		const command = new DeleteUserAddressCommand(randomUUID(), randomUUID());

		userRepository.findById.mockResolvedValue(userAddress.user());
		getAuthenticatedUser.execute.mockReturnValue(userAddress.user().id());
		userAddressRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(UserAddressNotFoundError);
	});

	it('should not delete a user address that does not belong to the user', async () => {
		const user = mockUser();

		const command = new DeleteUserAddressCommand(randomUUID(), randomUUID());

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());
		userAddressRepository.findById.mockResolvedValue(mockUserAddress());

		await expect(service.execute(command)).rejects.toThrow(UserAddressNotFoundError);
	});
});

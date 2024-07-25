import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { DeleteUserAddressCommand } from '../../ports/in/commands/delete-user-address.command';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import { DeleteUserAddressService } from '../delete-user-address.service';
import { UserAddressNotFoundError } from '../errors/user-address-not-found.error';
import { mockUser, mockUserAddress } from './user-mock.helper';

describe('DeleteUserAddressService', () => {
	let service: DeleteUserAddressService;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			DeleteUserAddressService,
		).compile();

		service = unit;
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should delete an user address', async () => {
		const userAddress = mockUserAddress();
		const user = userAddress.user();

		const command = new DeleteUserAddressCommand(
			userAddress.id(),
			user.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userAddressRepository.findById.mockResolvedValue(userAddress);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(userAddress.isDeleted()).toBe(true);
	});

	it('should not delete an user address if user is not authorized', async () => {
		const userAddress = mockUserAddress();
		const user = userAddress.user();

		const command = new DeleteUserAddressCommand(
			userAddress.id(),
			user.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not delete an user address if it does not exist', async () => {
		const user = mockUser();

		const command = new DeleteUserAddressCommand(randomUUID(), user.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userAddressRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserAddressNotFoundError,
		);
	});
});

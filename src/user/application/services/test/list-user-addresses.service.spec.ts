import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { ListUserAddressesService } from '../list-user-addresses.service';
import { TestBed } from '@automock/jest';
import { Pagination } from 'src/common/common.repository';
import { ListUserAddressesCommand } from '../../ports/in/commands/list-user-addresses.command';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { mockUser, mockUserAddress } from './user-mock.helper';
import { randomUUID } from 'crypto';

describe('ListUserAddressesService', () => {
	let service: ListUserAddressesService;
	let userRepository: jest.Mocked<UserRepository>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			ListUserAddressesService,
		).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list user addresses', async () => {
		const user = mockUser();

		const command = new ListUserAddressesCommand(randomUUID());

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());
		userAddressRepository.paginate.mockResolvedValue(
			new Pagination(
				[mockUserAddress(), mockUserAddress(), mockUserAddress()],
				3,
				0,
			),
		);

		const addresses = await service.execute(command);

		expect(addresses.total).toBe(3);
		expect(addresses.current_page).toBe(0);
		expect(addresses.next_page).toBe(false);
	});

	it('should not list user addresses if user is not authenticated', async () => {
		const user = mockUser();

		const command = new ListUserAddressesCommand(randomUUID());

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not list user addresses if user is not found', async () => {
		const command = new ListUserAddressesCommand(randomUUID());

		userRepository.findById.mockResolvedValue(null);
		getAuthenticatedUser.execute.mockReturnValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});
});

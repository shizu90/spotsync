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
import { randomUUID } from 'crypto';
import { User } from 'src/user/domain/user.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { UserAddress } from 'src/user/domain/user-address.model';
import { Pagination } from 'src/common/common.repository';
import { ListUserAddressesCommand } from '../../ports/in/commands/list-user-addresses.command';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UserNotFoundError } from '../errors/user-not-found.error';

const command = new ListUserAddressesCommand(randomUUID());

const mockUser = () => {
	const id = randomUUID();

	return User.create(
		id,
		'Teste123',
		null,
		null,
		null,
		null,
		null,
		null,
		UserCredentials.create(
			id,
			'Test',
			'test@test.test',
			'Test123',
			null,
			null,
			null,
		),
		UserVisibilityConfig.create(
			id,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
		),
		new Date(),
		new Date(),
		false,
	);
};

const mockUserAddress = () => {
	const id = randomUUID();

	return UserAddress.create(
		id,
		'Test Address',
		'Area',
		'Sub area',
		'Locality',
		0,
		0,
		'BR',
		true,
		mockUser(),
	);
};

const mockUserAddresses = () => {
	return [mockUserAddress(), mockUserAddress(), mockUserAddress()];
};

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

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(user.id());
		userAddressRepository.paginate.mockResolvedValue(
			new Pagination(mockUserAddresses(), 3, 0),
		);

		const addresses = await service.execute(command);

		expect(addresses.total).toBe(3);
		expect(addresses.current_page).toBe(0);
		expect(addresses.next_page).toBe(false);
	});

	it('should not list user addresses if user is not authenticated', () => {
		const user = mockUser();

		userRepository.findById.mockResolvedValue(user);
		getAuthenticatedUser.execute.mockReturnValue(null);

		service.execute(command).catch((e) => {
			expect(e.constructor).toBe(UnauthorizedAccessError);
		});
	});

	it('should not list user addresses if user is not found', () => {
		userRepository.findById.mockResolvedValue(null);
		getAuthenticatedUser.execute.mockReturnValue(null);

		service.execute(command).catch((e) => {
			expect(e.constructor).toBe(UserNotFoundError);
		});
	});
});

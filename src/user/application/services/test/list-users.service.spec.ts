import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { ListUsersService } from '../list-users.service';
import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import { User } from 'src/user/domain/user.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import { get } from 'http';
import { ListUsersCommand } from '../../ports/in/commands/list-users.command';
import { Pagination } from 'src/common/common.repository';
import { mockUser } from './user-mock.helper';

describe('ListUsersService', () => {
	let service: ListUsersService;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let followRepository: jest.Mocked<FollowRepository>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(ListUsersService).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		followRepository = unitRef.get(FollowRepositoryProvider);
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list users', async () => {
		const command = new ListUsersCommand();

		userRepository.paginate.mockResolvedValue(
			new Pagination([mockUser(), mockUser(), mockUser()], 3, 0),
		);
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		followRepository.findBy.mockResolvedValue([]);
		userAddressRepository.findBy.mockResolvedValue([]);

		const pagination = await service.execute(command);

		expect(pagination.total).toBe(3);
		expect(pagination.current_page).toBe(0);
		expect(pagination.next_page).toBe(false);
	});
});

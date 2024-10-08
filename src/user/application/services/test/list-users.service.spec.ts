import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { ListUsersCommand } from '../../ports/in/commands/list-users.command';
import { GetUserProfileDto } from '../../ports/out/dto/get-user-profile.dto';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { ListUsersService } from '../list-users.service';
import { mockUser } from './user-mock.helper';

describe('ListUsersService', () => {
	let service: ListUsersService;
	let userRepository: jest.Mocked<UserRepository>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let followRepository: jest.Mocked<FollowRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(ListUsersService).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list users', async () => {
		const command = new ListUsersCommand(
			null,
			null,
			'created_at',
			SortDirection.DESC,
			1,
			true,
			10,
		);

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());
		userRepository.paginate.mockResolvedValue(
			new Pagination([mockUser(), mockUser(), mockUser()], 3, 0, 10),
		);
		userAddressRepository.findBy.mockResolvedValue([]);
		followRepository.findBy.mockResolvedValue([]);
		followRepository.countBy.mockResolvedValue(0);

		const users = await service.execute(command);

		expect(users).toBeInstanceOf(Pagination<GetUserProfileDto>);

		if (users instanceof Pagination) {
			expect(users.total).toBe(3);
			expect(users.current_page).toBe(0);
			expect(users.items).toHaveLength(3);
			expect(users.has_next_page).toBeFalsy();
		}
	});
});

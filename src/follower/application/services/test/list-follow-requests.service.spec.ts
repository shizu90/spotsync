import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/common.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { ListFollowRequestsCommand } from '../../ports/in/commands/list-follow-requests.command';
import { GetFollowRequestDto } from '../../ports/out/dto/get-follow-request.dto';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../../ports/out/follow.repository';
import { ListFollowRequestsService } from '../list-follow-requests.service';
import { mockFollowRequest, mockUser } from './follow-mock.helper';

describe('ListFollowRequestsService', () => {
	let service: ListFollowRequestsService;
	let followRepository: jest.Mocked<FollowRepository>;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			ListFollowRequestsService,
		).compile();

		service = unit;
		followRepository = unitRef.get(FollowRepositoryProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list follow requests', async () => {
		const user = mockUser();

		const command = new ListFollowRequestsCommand(user.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userRepository.findById.mockResolvedValue(user);
		followRepository.findBy.mockResolvedValue([]);
		followRepository.paginateRequest.mockResolvedValue(
			new Pagination([mockFollowRequest(), mockFollowRequest()], 2, 0),
		);

		const requests = await service.execute(command);

		expect(requests).toBeInstanceOf(Pagination<GetFollowRequestDto>);
		expect(requests.total).toBe(2);
		expect(requests.items).toHaveLength(2);
		expect(requests.current_page).toBe(0);
		expect(requests.next_page).toBeFalsy();
	});
});

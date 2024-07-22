import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../../ports/out/follow.repository';
import { TestBed } from '@automock/jest';
import { ListFollowRequestsService } from '../list-follow-requests.service';
import { ListFollowRequestsCommand } from '../../ports/in/commands/list-follow-requests.command';
import { mockFollowRequest, mockUser } from './follow-mock.helper';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { Pagination } from 'src/common/common.repository';
import e from 'express';

describe('ListFollowRequestsService', () => {
	let service: ListFollowRequestsService;
	let followRepository: jest.Mocked<FollowRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let userRepository: jest.Mocked<UserRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			ListFollowRequestsService,
		).compile();

		service = unit;
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list follow requests', async () => {
		const user = mockUser();
		const command = new ListFollowRequestsCommand(user.id());

		getAuthenticatedUser.execute.mockReturnValue(user.id());
		userRepository.findById.mockResolvedValue(user);
		followRepository.findBy.mockResolvedValue([]);
		followRepository.paginateRequest.mockResolvedValue(
			new Pagination(
				[mockFollowRequest(), mockFollowRequest(), mockFollowRequest()],
				3,
				0,
			),
		);

		const response = await service.execute(command);

		expect(response.total).toBe(3);
		expect(response.current_page).toBe(0);
		expect(response.next_page).toBe(false);
	});
});

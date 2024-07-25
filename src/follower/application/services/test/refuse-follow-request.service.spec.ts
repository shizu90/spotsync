import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { RefuseFollowRequestCommand } from '../../ports/in/commands/refuse-follow-request.command';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../../ports/out/follow.repository';
import { RefuseFollowRequestService } from '../refuse-follow-request.service';
import { mockFollowRequest, mockUser } from './follow-mock.helper';

describe('RefuseFollowRequestService', () => {
	let service: RefuseFollowRequestService;
	let followRepository: jest.Mocked<FollowRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			RefuseFollowRequestService,
		).compile();

		service = unit;
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should refuse follow request', async () => {
		const followRequest = mockFollowRequest();
		const user = followRequest.to();

		const command = new RefuseFollowRequestCommand(followRequest.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		followRepository.findRequestById.mockResolvedValue(followRequest);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not refuse follow request if user is not authorized', async () => {
		const followRequest = mockFollowRequest();
		const user = followRequest.to();

		const command = new RefuseFollowRequestCommand(followRequest.id());

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());
		followRepository.findRequestById.mockResolvedValue(followRequest);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

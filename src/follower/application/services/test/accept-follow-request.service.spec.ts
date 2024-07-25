import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { AcceptFollowRequestCommand } from '../../ports/in/commands/accept-follow-request.command';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../../ports/out/follow.repository';
import { AcceptFollowRequestService } from '../accept-follow-request.service';
import { FollowRequestNotFoundError } from '../errors/follow-request-not-found.error';
import { mockFollowRequest, mockUser } from './follow-mock.helper';

describe('AcceptFollowRequestService', () => {
	let service: AcceptFollowRequestService;
	let followRepository: jest.Mocked<FollowRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			AcceptFollowRequestService,
		).compile();

		service = unit;
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should accept follow request', async () => {
		const followRequest = mockFollowRequest();
		const user = followRequest.to();

		const command = new AcceptFollowRequestCommand(followRequest.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		followRepository.findRequestById.mockResolvedValue(followRequest);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not accept follow request if user is not authorized', async () => {
		const followRequest = mockFollowRequest();
		const user = followRequest.to();

		const command = new AcceptFollowRequestCommand(followRequest.id());

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());
		followRepository.findRequestById.mockResolvedValue(followRequest);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not accept follow request if it does not exist', async () => {
		const user = mockUser();

		const command = new AcceptFollowRequestCommand(randomUUID());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		followRepository.findRequestById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			FollowRequestNotFoundError,
		);
	});
});

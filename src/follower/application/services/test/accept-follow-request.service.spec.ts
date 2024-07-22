import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../../ports/out/follow.repository';
import { AcceptFollowRequestService } from '../accept-follow-request.service';
import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import { FollowRequest } from 'src/follower/domain/follow-request.model';
import { User } from 'src/user/domain/user.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { AcceptFollowRequestCommand } from '../../ports/in/commands/accept-follow-request.command';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { FollowRequestNotFoundError } from '../errors/follow-request-not-found.error';
import { mockFollowRequest } from './follow-mock.helper';

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

		const command = new AcceptFollowRequestCommand(randomUUID());

		getAuthenticatedUser.execute.mockReturnValue(followRequest.to().id());
		followRepository.findRequestById.mockResolvedValue(followRequest);

		await service.execute(command);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not accept follow request if follow request is not found', async () => {
		const command = new AcceptFollowRequestCommand(randomUUID());

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		followRepository.findRequestById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			FollowRequestNotFoundError,
		);
	});

	it('should not accept follow request if user is not authenticated', async () => {
		const followRequest = mockFollowRequest();

		const command = new AcceptFollowRequestCommand(randomUUID());

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		followRepository.findRequestById.mockResolvedValue(followRequest);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

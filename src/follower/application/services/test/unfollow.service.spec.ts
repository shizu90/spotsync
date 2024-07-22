import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../../ports/out/follow.repository';
import { TestBed } from '@automock/jest';
import { UnfollowService } from '../unfollow.service';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { mockFollow } from './follow-mock.helper';
import { UnfollowCommand } from '../../ports/in/commands/unfollow.command';
import { randomUUID } from 'crypto';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';

describe('UnfollowService', () => {
	let service: UnfollowService;
	let followRepository: jest.Mocked<FollowRepository>;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(UnfollowService).compile();

		service = unit;
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should unfollow user', async () => {
		const follow = mockFollow();

		const command = new UnfollowCommand(
			follow.from().id(),
			follow.to().id(),
		);

		userRepository.findById
			.mockResolvedValueOnce(follow.from())
			.mockResolvedValueOnce(follow.to());
		getAuthenticatedUser.execute.mockReturnValue(follow.from().id());
		followRepository.findBy.mockResolvedValue([follow]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not unfollow user if from user does not exist', async () => {
		const follow = mockFollow();

		const command = new UnfollowCommand(randomUUID(), follow.to().id());

		userRepository.findById.mockResolvedValueOnce(null);
		followRepository.findBy.mockResolvedValue([]);

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});

	it('should not unfollow user if to user does not exist', async () => {
		const follow = mockFollow();

		const command = new UnfollowCommand(randomUUID(), follow.to().id());

		userRepository.findById
			.mockResolvedValueOnce(follow.from())
			.mockResolvedValueOnce(null);
		getAuthenticatedUser.execute.mockReturnValue(follow.from().id());
		followRepository.findBy.mockResolvedValue([]);

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});

	it('should not unfollow user if user is not authenticated', async () => {
		const follow = mockFollow();

		const command = new UnfollowCommand(
			follow.from().id(),
			follow.to().id(),
		);

		userRepository.findById.mockResolvedValueOnce(follow.from());
		getAuthenticatedUser.execute.mockReturnValue(randomUUID());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});

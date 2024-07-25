import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { FollowCommand } from '../../ports/in/commands/follow.command';
import { FollowDto } from '../../ports/out/dto/follow.dto';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../../ports/out/follow.repository';
import { AlreadyFollowingError } from '../errors/already-following.error';
import { FollowService } from '../follow.service';
import { mockFollow, mockUser } from './follow-mock.helper';

describe('FollowService', () => {
	let service: FollowService;
	let followRepository: jest.Mocked<FollowRepository>;
	let userRepository: jest.Mocked<UserRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(FollowService).compile();

		service = unit;
		followRepository = unitRef.get(FollowRepositoryProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should follow user', async () => {
		const fromUser = mockUser();
		const toUser = mockUser();

		const command = new FollowCommand(fromUser.id(), toUser.id());

		getAuthenticatedUser.execute.mockResolvedValue(fromUser);
		userRepository.findById.mockResolvedValue(toUser);
		followRepository.findBy.mockResolvedValue([]);

		const follow = await service.execute(command);

		expect(follow).toBeInstanceOf(FollowDto);
		expect(follow.from_user_id).toBe(fromUser.id());
		expect(follow.to_user_id).toBe(toUser.id());
		expect(follow.requested_on).toEqual(follow.followed_on);
	});

	it('should not follow user if user is not authorized', async () => {
		const fromUser = mockUser();
		const toUser = mockUser();

		const command = new FollowCommand(fromUser.id(), toUser.id());

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not follow user if to user does not exist', async () => {
		const fromUser = mockUser();

		const command = new FollowCommand(fromUser.id(), randomUUID());

		getAuthenticatedUser.execute.mockResolvedValue(fromUser);
		userRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});

	it('should not follow user if already following', async () => {
		const fromUser = mockUser();
		const toUser = mockUser();

		const command = new FollowCommand(fromUser.id(), toUser.id());

		getAuthenticatedUser.execute.mockResolvedValue(fromUser);
		userRepository.findById.mockResolvedValue(toUser);
		followRepository.findBy.mockResolvedValue([mockFollow()]);

		await expect(service.execute(command)).rejects.toThrow(
			AlreadyFollowingError,
		);
	});
});

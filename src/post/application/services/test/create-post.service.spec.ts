import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { CreatePostService } from '../create-post.service';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from 'src/group/application/ports/out/group.repository';
import { TestBed } from '@automock/jest';
import { CreatePostCommand } from '../../ports/in/commands/create-post.command';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { randomUUID } from 'crypto';
import { mockGroup, mockPost, mockUser } from './post-mock.helper';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupNotFoundError } from 'src/group/application/services/errors/group-not-found.error';

describe('CreatePostService', () => {
	let service: CreatePostService;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let userRepository: jest.Mocked<UserRepository>;
	let groupRepository: jest.Mocked<GroupRepository>;
	let postRepository: jest.Mocked<PostRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(CreatePostService).compile();

		service = unit;
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
		groupRepository = unitRef.get(GroupRepositoryProvider);
		postRepository = unitRef.get(PostRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a post', async () => {
		const post = mockPost();

		const command = new CreatePostCommand(
			'Test Post',
			'Test Content',
			PostVisibility.PUBLIC,
			post.creator().id(),
			post.parent().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(post.creator().id());
		userRepository.findById.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(post.parent());

		const response = await service.execute(command);

		expect(response.depth_level).toBe(1);
		expect(response.title).toBe(command.title);
		expect(response.parent_id).toBe(post.parent().id());
		expect(response.thread_id).toBe(post.parent().thread().id());
	});

	it('should not create a post if user does not exist', async () => {
		const post = mockPost();

		const command = new CreatePostCommand(
			'Test Post',
			'Test Content',
			PostVisibility.PUBLIC,
			post.creator().id(),
			post.parent().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		userRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			UserNotFoundError,
		);
	});

	it('should not create a post if user is not authenticated', async () => {
		const post = mockPost();

		const command = new CreatePostCommand(
			'Test Post',
			'Test Content',
			PostVisibility.PUBLIC,
			post.creator().id(),
			post.parent().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		userRepository.findById.mockResolvedValue(post.creator());

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not create a post if group does not exist', async () => {
		const post = mockPost();

		const command = new CreatePostCommand(
			'Test Post',
			'Test Content',
			PostVisibility.PUBLIC,
			post.creator().id(),
			post.parent().id(),
			randomUUID(),
		);

		getAuthenticatedUser.execute.mockReturnValue(post.creator().id());
		userRepository.findById.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(post.parent());
		groupRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			GroupNotFoundError,
		);
	});
});

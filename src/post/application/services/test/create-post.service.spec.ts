import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from 'src/group/application/ports/out/group.repository';
import { GroupNotFoundError } from 'src/group/application/services/errors/group-not-found.error';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { CreatePostCommand } from '../../ports/in/commands/create-post.command';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { CreatePostService } from '../create-post.service';
import { mockPost } from './post-mock.helper';

describe('CreatePostService', () => {
	let service: CreatePostService;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let groupRepository: jest.Mocked<GroupRepository>;
	let postRepository: jest.Mocked<PostRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(CreatePostService).compile();

		service = unit;
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		groupRepository = unitRef.get(GroupRepositoryProvider);
		postRepository = unitRef.get(PostRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a post', async () => {
		const post = mockPost();
		const parent = mockPost();

		const command = new CreatePostCommand(
			'Test Post',
			'Test Content',
			PostVisibility.PUBLIC,
			parent.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(parent);

		const response = await service.execute(command);

		expect(response.depth_level).toBe(1);
		expect(response.title).toBe(command.title);
		expect(response.parent_id).toBe(parent.id());
		expect(response.thread_id).toBe(parent.thread().id());
	});

	it('should not create a post if group does not exist', async () => {
		const post = mockPost();
		const parent = mockPost();

		const command = new CreatePostCommand(
			'Test Post',
			'Test Content',
			PostVisibility.PUBLIC,
			parent.id(),
			randomUUID(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(parent);
		groupRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			GroupNotFoundError,
		);
	});
});

import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UpdatePostService } from '../update-post.service';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { TestBed } from '@automock/jest';
import { mockPost } from './post-mock.helper';
import { UpdatePostCommand } from '../../ports/in/commands/update-post.command';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { randomUUID } from 'crypto';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { PostNotFoundError } from '../errors/post-not-found.error';

describe('UpdatePostService', () => {
	let service: UpdatePostService;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let postRepository: jest.Mocked<PostRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(UpdatePostService).compile();

		service = unit;
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		postRepository = unitRef.get(PostRepositoryProvider);
	});

	it('should be defined', async () => {
		expect(service).toBeDefined();
	});

	it('should update post', async () => {
		const post = mockPost();

		const command = new UpdatePostCommand(
			post.id(),
			'New Test Title',
			'New Test Content',
			PostVisibility.PRIVATE,
		);

		getAuthenticatedUser.execute.mockReturnValue(post.creator().id());
		postRepository.findById.mockResolvedValue(post);

		await service.execute(command);

		expect(post.title()).toBe(command.title);
		expect(post.content()).toBe(command.content);
		expect(post.visibility()).toBe(command.visibility);
	});

	it('should not update post if user is not authenticated', async () => {
		const post = mockPost();

		const command = new UpdatePostCommand(
			post.id(),
			'New Test Title',
			'New Test Content',
			PostVisibility.PRIVATE,
		);

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		postRepository.findById.mockResolvedValue(post);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not update post if post does not exist', async () => {
		const command = new UpdatePostCommand(
			randomUUID(),
			'New Test Title',
			'New Test Content',
			PostVisibility.PRIVATE,
		);

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		postRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			PostNotFoundError,
		);
	});
});

import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from 'src/group/application/ports/out/group-member.repository';
import { DeletePostCommand } from '../../ports/in/commands/delete-post.command';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { DeletePostService } from '../delete-post.service';
import { PostNotFoundError } from '../errors/post-not-found.error';
import { mockPost, mockUser } from './post-mock.helper';

describe('DeletePostService', () => {
	let service: DeletePostService;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let postRepository: jest.Mocked<PostRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(DeletePostService).compile();

		service = unit;
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		postRepository = unitRef.get(PostRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should delete post', async () => {
		const post = mockPost();

		const command = new DeletePostCommand(post.id());

		getAuthenticatedUser.execute.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(post);
		postRepository.findBy.mockResolvedValue([]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not delete post if post does not exist', async () => {
		const command = new DeletePostCommand(randomUUID());

		getAuthenticatedUser.execute.mockResolvedValue(mockUser());
		postRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			PostNotFoundError,
		);
	});
});

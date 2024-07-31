import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { RemovePostAttachmentCommand } from '../../ports/in/commands/remove-post-attachment.command';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { RemovePostAttachmentService } from '../remove-post-attachment.service';
import { mockPost } from './post-mock.helper';

describe('RemovePostAttachmentService', () => {
	let service: RemovePostAttachmentService;
	let postRepository: jest.Mocked<PostRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			RemovePostAttachmentService,
		).compile();

		service = unit;
		postRepository = unitRef.get(PostRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should remove attachment from post', async () => {
		const post = mockPost();
		const attachment = PostAttachment.create(
			randomUUID(),
			'file',
			'image/png',
		);

		post.addAttachment(attachment);

		const command = new RemovePostAttachmentCommand(
			attachment.id(),
			post.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(post);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(post.attachments()).toHaveLength(0);
	});
});

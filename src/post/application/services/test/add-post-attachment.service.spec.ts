import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { AddPostAttachmentCommand } from '../../ports/in/commands/add-post-attachment.command';
import { AddPostAttachmentDto } from '../../ports/out/dto/add-post-attachment.dto';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { AddPostAttachmentService } from '../add-post-attachment.service';
import { mockPost } from './post-mock.helper';

describe('AddPostAttachmentService', () => {
	let service: AddPostAttachmentService;
	let postRepository: jest.Mocked<PostRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			AddPostAttachmentService,
		).compile();

		service = unit;
		postRepository = unitRef.get(PostRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should add attachment to post', async () => {
		const post = mockPost();

		const command = new AddPostAttachmentCommand(null, '', '');

		getAuthenticatedUser.execute.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(post);

		const attachment = await service.execute(command);

		expect(attachment).toBeInstanceOf(AddPostAttachmentDto);
	});
});

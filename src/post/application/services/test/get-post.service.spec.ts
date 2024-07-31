import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from 'src/group/application/ports/out/group-member.repository';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from 'src/like/application/ports/out/like.repository';
import { GetPostCommand } from '../../ports/in/commands/get-post.command';
import { GetPostDto } from '../../ports/out/dto/get-post.dto';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { GetPostService } from '../get-post.service';
import { mockPost, mockUser } from './post-mock.helper';

describe('GetPostService', () => {
	let service: GetPostService;
	let postRepository: jest.Mocked<PostRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let followRepository: jest.Mocked<FollowRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let likeRepository: jest.Mocked<LikeRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(GetPostService).compile();

		service = unit;
		postRepository = unitRef.get(PostRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		likeRepository = unitRef.get(LikeRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get post', async () => {
		const user = mockUser();
		const post = mockPost();

		const command = new GetPostCommand(post.id());

		getAuthenticatedUser.execute.mockResolvedValue(post.creator());
		postRepository.findById.mockResolvedValue(post);
		likeRepository.findBy
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([]);

		const p = await service.execute(command);

		expect(p).toBeInstanceOf(GetPostDto);
		expect(p.children_posts).toHaveLength(post.childrens().length);
		expect(p.children_posts.at(0)).toBeDefined();
		expect(p.children_posts.at(0).children_posts).toHaveLength(
			post.childrens().at(0).childrens().length,
		);
	});
});

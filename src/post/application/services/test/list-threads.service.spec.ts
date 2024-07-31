import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/common.repository';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from 'src/group/application/ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from 'src/group/application/ports/out/group.repository';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from 'src/like/application/ports/out/like.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { ListThreadsCommand } from '../../ports/in/commands/list-threads.command';
import { GetPostDto } from '../../ports/out/dto/get-post.dto';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../../ports/out/post.repository';
import { ListThreadsService } from '../list-threads.service';
import { mockPost, mockUser } from './post-mock.helper';

describe('ListThreadsService', () => {
	let service: ListThreadsService;
	let likeRepository: jest.Mocked<LikeRepository>;
	let postRepository: jest.Mocked<PostRepository>;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let userRepository: jest.Mocked<UserRepository>;
	let followRepository: jest.Mocked<FollowRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(ListThreadsService).compile();

		service = unit;
		likeRepository = unitRef.get(LikeRepositoryProvider);
		postRepository = unitRef.get(PostRepositoryProvider);
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
		followRepository = unitRef.get(FollowRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list threads', async () => {
		const user = mockUser();

		const command = new ListThreadsCommand(null, user.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userRepository.findById.mockResolvedValue(user);
		postRepository.paginate.mockResolvedValue(
			new Pagination([mockPost(), mockPost()], 2, 0),
		);
		likeRepository.findBy.mockResolvedValue([]);

		const threads = await service.execute(command);

		expect(threads).toBeInstanceOf(Pagination<GetPostDto>);
		expect(threads.items).toHaveLength(2);
		expect(threads.current_page).toBe(0);
		expect(threads.next_page).toBeFalsy();
		expect(threads.total).toBe(2);
	});
});

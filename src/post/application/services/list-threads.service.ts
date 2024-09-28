import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
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
import { GroupNotFoundError } from 'src/group/application/services/errors/group-not-found.error';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from 'src/like/application/ports/out/like.repository';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { ListThreadsCommand } from '../ports/in/commands/list-threads.command';
import { ListThreadsUseCase } from '../ports/in/use-cases/list-threads.use-case';
import { PostDto } from '../ports/out/dto/post.dto';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../ports/out/post.repository';

@Injectable()
export class ListThreadsService implements ListThreadsUseCase {
	constructor(
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
	) {}

	public async execute(
		command: ListThreadsCommand,
	): Promise<Pagination<PostDto> | Array<PostDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		let visibilitiesToFilter = [PostVisibility.PUBLIC];

		if (command.groupId !== null && command.groupId !== undefined) {
			const group = await this.groupRepository.findById(command.groupId);

			if (group === null || group === undefined || group.isDeleted()) {
				throw new GroupNotFoundError();
			}

			switch (group.visibilitySettings().posts()) {
				case GroupVisibility.PRIVATE:
					const groupMember = await this.groupMemberRepository.findBy(
						{
							groupId: group.id(),
							userId: authenticatedUser.id(),
						},
					);

					if (groupMember === null || groupMember === undefined) {
						throw new UnauthorizedAccessError(
							`Unauthorized access`,
						);
					}

					visibilitiesToFilter = [PostVisibility.PRIVATE];

					break;
				case GroupVisibility.PUBLIC:
				default:
					break;
			}
		}

		if (
			command.userId !== null &&
			command.userId !== undefined &&
			(command.groupId === null || command.groupId === undefined)
		) {
			const user = await this.userRepository.findById(command.userId);

			if (user === null || user === undefined || user.isDeleted()) {
				throw new UserNotFoundError();
			}

			switch (user.visibilitySettings().posts()) {
				case UserVisibility.FOLLOWERS:
					const follow = (
						await this.followRepository.findBy({
							fromUserId: authenticatedUser.id(),
							toUserId: user.id(),
						})
					).at(0);

					if (follow === null || follow === undefined) {
						throw new UnauthorizedAccessError(
							`Unauthorized access`,
						);
					}

					visibilitiesToFilter = [
						PostVisibility.PUBLIC,
						PostVisibility.FOLLOWERS,
					];

					break;
				case UserVisibility.PRIVATE:
				case UserVisibility.PUBLIC:
					break;
			}
		}

		const pagination = await this.postRepository.paginate({
			filters: {
				groupId: command.groupId,
				visibility: visibilitiesToFilter,
				userId: command.userId,
				depthLevel: 0,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			paginate: command.paginate,
			page: command.page,
			limit: command.limit,
		});

		const items = await Promise.all(
			pagination.items.map(async (i) => {
				const totalLikes = (
					await this.likeRepository.findBy({
						subject: LikableSubject.POST,
						subjectId: i.id(),
					})
				).length;

				const liked =
					(
						await this.likeRepository.findBy({
							subject: LikableSubject.POST,
							subjectId: i.id(),
							userId: authenticatedUser.id(),
						})
					).at(0) !== undefined;

				const totalChildrens = await this.postRepository.countBy({
					parentId: i.id(),
				});

				return PostDto.fromModel(i)
					.setTotalLikes(totalLikes)
					.setLiked(liked);
			}),
		);

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from 'src/group/application/ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from 'src/group/application/ports/out/group.repository';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
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

		const pagination = await this.postRepository.paginate({
			filters: {
				groupId: command.groupId,
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
				switch(i.visibility()) {
					case PostVisibility.PRIVATE:
						if (i.group() !== null) {
							const isMember = (await this.groupMemberRepository.findBy({
								userId: authenticatedUser.id(),
								groupId: i.group().id(),
								status: GroupMemberStatus.ACTIVE,
							})).length > 0;

							if (!isMember) return undefined;
						} else {
							if (i.creator().id() !== authenticatedUser.id()) return undefined;
						}
						break;
					case PostVisibility.FOLLOWERS:
						const ifFollowing = (await this.followRepository.findBy({
							fromUserId: authenticatedUser.id(),
							toUserId: i.creator().id(),
							status: FollowStatus.ACTIVE,
						})).length > 0;

						if (!ifFollowing) return undefined;
						break;
					default: break;
				}

				const liked =
					(
						await this.likeRepository.findBy({
							subject: LikableSubject.POST,
							subjectId: i.id(),
							userId: authenticatedUser.id(),
						})
					).length > 0;

				const totalLikes = await this.likeRepository.countBy({
					subject: LikableSubject.POST,
					subjectId: i.id(),
				});

				const totalChildrens = await this.postRepository.countBy({
					parentId: i.id(),
				});

				return PostDto.fromModel(i)
					.setLiked(liked)
					.setTotalChildrens(totalChildrens)
					.setTotalLikes(totalLikes);
			}),
		);

		if (!command.paginate) {
			return items;
		}

		return new Pagination(
			items,
			pagination.total,
			pagination.current_page,
			pagination.limit,
		);
	}
}

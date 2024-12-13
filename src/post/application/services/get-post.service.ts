import { Inject, Injectable } from '@nestjs/common';
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
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { GetPostCommand } from '../ports/in/commands/get-post.command';
import { GetPostUseCase } from '../ports/in/use-cases/get-post.use-case';
import { PostDto } from '../ports/out/dto/post.dto';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../ports/out/post.repository';
import { PostNotFoundError } from './errors/post-not-found.error';

@Injectable()
export class GetPostService implements GetPostUseCase {
	constructor(
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
	) {}

	public async execute(command: GetPostCommand): Promise<PostDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const post = await this.postRepository.findAuthorizedPostById(authenticatedUser.id(), command.id);

		if (post === null || post === undefined) {
			throw new PostNotFoundError();
		}

		const liked =
			(
				await this.likeRepository.findBy({
					subject: LikableSubject.POST,
					subjectId: post.id(),
					userId: authenticatedUser.id(),
				})
			).length > 0;

		return PostDto.fromModel(post)
			.setLiked(liked)
			.setAttachmentUrls();
	}
}

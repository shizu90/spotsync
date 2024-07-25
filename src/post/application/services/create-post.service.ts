import { Inject, Injectable } from '@nestjs/common';
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
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { Post } from 'src/post/domain/post.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { CreatePostCommand } from '../ports/in/commands/create-post.command';
import { CreatePostUseCase } from '../ports/in/use-cases/create-post.use-case';
import { CreatePostDto } from '../ports/out/dto/create-post.dto';
import {
	PostThreadRepository,
	PostThreadRepositoryProvider,
} from '../ports/out/post-thread.repository';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../ports/out/post.repository';
import { PostNotFoundError } from './errors/post-not-found.error';

@Injectable()
export class CreatePostService implements CreatePostUseCase {
	constructor(
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(PostThreadRepositoryProvider)
		protected postThreadRepository: PostThreadRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
	) {}

	public async execute(command: CreatePostCommand): Promise<CreatePostDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		let parent: Post = null;

		if (command.parentId !== null && command.parentId !== undefined) {
			const post = await this.postRepository.findById(command.parentId);

			if (post === null || post === undefined) {
				throw new PostNotFoundError(`Parent post not found`);
			}

			parent = post;
		}

		let visibility = command.visibility;

		if (visibility === null || visibility === undefined) {
			switch (authenticatedUser.visibilityConfiguration().postVisibility()) {
				case UserVisibility.PUBLIC:
					visibility = PostVisibility.PUBLIC;
					break;
				case UserVisibility.PRIVATE:
					visibility = PostVisibility.PRIVATE;
					break;
				case UserVisibility.FOLLOWERS:
					visibility = PostVisibility.FOLLOWERS;
					break;
				default:
					visibility = PostVisibility.PUBLIC;
					break;
			}
		}

		let group: Group = null;

		if (command.groupId !== null && command.groupId !== undefined) {
			const g = await this.groupRepository.findById(command.groupId);

			if (g === null || g === undefined || g.isDeleted()) {
				throw new GroupNotFoundError(`Group not found`);
			}

			group = g;
			switch (g.visibilityConfiguration().postVisibility()) {
				case GroupVisibility.PRIVATE:
					visibility = PostVisibility.PRIVATE;
					break;
				case GroupVisibility.PUBLIC:
					visibility = PostVisibility.PUBLIC;
					break;
				default:
					visibility = PostVisibility.PUBLIC;
					break;
			}
		}

		const post = Post.create(
			randomUUID(),
			command.title,
			command.content,
			visibility,
			authenticatedUser,
			[],
			parent,
			group,
		);

		if (post.thread().maxDepthLevel() === 0) {
			await this.postThreadRepository.store(post.thread());
		}
		this.postRepository.store(post);

		return new CreatePostDto(
			post.id(),
			post.title(),
			post.content(),
			post.visibility(),
			[],
			post.thread().id(),
			post.depthLevel(),
			post.parent() ? post.parent().id() : null,
			post.creator().id(),
			post.group() ? post.group().id() : null,
		);
	}
}

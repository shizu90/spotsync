import {
	PostAttachment as PostAttachmentPrisma,
	Post as PostPrisma,
} from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import {
	GroupEntity,
	GroupEntityMapper,
} from 'src/group/infrastructure/adapters/out/mappers/group-entity.mapper';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { Post } from 'src/post/domain/post.model';
import {
	UserEntity,
	UserEntityMapper,
} from 'src/user/infrastructure/adapters/out/mappers/user-entity.mapper';
import {
	PostThreadEntity,
	PostThreadEntityMapper,
} from './post-thread-entity.mapper';

export type PostEntity = PostPrisma & {
	parent_post?: PostEntity;
	attachments?: PostAttachmentPrisma[];
	children_posts?: PostEntity[];
	creator?: UserEntity;
	group?: GroupEntity;
	thread?: PostThreadEntity;
};

export class PostEntityMapper implements EntityMapper<Post, PostEntity> {
	private _userEntityMapper: UserEntityMapper = new UserEntityMapper();
	private _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper();
	private _postThreadEntityMapper: PostThreadEntityMapper =
		new PostThreadEntityMapper();

	public toEntity(model: Post): PostEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			title: model.title(),
			content: model.content(),
			created_at: model.createdAt(),
			depth_level: model.depthLevel(),
			updated_at: model.updatedAt(),
			visibility: model.visibility(),
			group_id: model.group() ? model.group().id() : null,
			total_likes: model.totalLikes(),
			parent_id: model.parent() ? model.parent().id() : null,
			thread_id: model.thread() ? model.thread().id() : null,
			user_id: model.creator() ? model.creator().id() : null,
			attachments: model.attachments()
				? model.attachments().map((attachment) => ({
						id: attachment.id(),
						file_path: attachment.filePath(),
						file_type: attachment.fileType(),
						post_id: model.id(),
					}))
				: [],
			children_posts: model.childrens()
				? model.childrens().map((child) => this.toEntity(child))
				: [],
			creator: model.creator()
				? this._userEntityMapper.toEntity(model.creator())
				: null,
			group: model.group()
				? this._groupEntityMapper.toEntity(model.group())
				: null,
			parent_post: model.parent() ? this.toEntity(model.parent()) : null,
			thread: model.thread()
				? this._postThreadEntityMapper.toEntity(model.thread())
				: null,
		};
	}

	public toModel(entity: PostEntity): Post {
		if (entity === null || entity === undefined) return null;

		return Post.create(
			entity.id,
			entity.title,
			entity.content,
			entity.visibility as PostVisibility,
			entity.creator
				? this._userEntityMapper.toModel(entity.creator)
				: null,
			entity.attachments
				? entity.attachments.map((attachment) =>
						PostAttachment.create(
							attachment.id,
							attachment.file_path,
							attachment.file_type,
						),
					)
				: [],
			entity.parent_post ? this.toModel(entity.parent_post) : null,
			entity.children_posts
				? entity.children_posts.map((child) => this.toModel(child))
				: [],
			entity.group ? this._groupEntityMapper.toModel(entity.group) : null,
			entity.total_likes,
			entity.thread
				? this._postThreadEntityMapper.toModel(entity.thread)
				: null,
			entity.depth_level,
			entity.created_at,
			entity.updated_at,
		);
	}
}

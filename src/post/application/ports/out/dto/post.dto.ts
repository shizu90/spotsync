import { Dto } from 'src/common/core/common.dto';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { Post } from 'src/post/domain/post.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

class PostAttachmentDto extends Dto {
	public id: string = undefined;
	public file_path: string = undefined;
	public file_type: string = undefined;

	private constructor(id?: string, file_path?: string, file_type?: string) {
		super();
		this.id = id;
		this.file_path = file_path;
		this.file_type = file_type;
	}

	public static fromModel(model: PostAttachment): PostAttachmentDto {
		if (model === null || model === undefined) return null;

		return new PostAttachmentDto(
			model.id(),
			model.filePath(),
			model.fileType(),
		);
	}
}

export class PostDto extends Dto {
	public id: string = undefined;
	public title: string = undefined;
	public content: string = undefined;
	public attachments: PostAttachmentDto[] = undefined;
	public creator: UserDto = undefined;
	public visibility: string = undefined;
	public depth_level: number = undefined;
	public thread_id: string = undefined;
	public created_at: string = undefined;
	public updated_at: string = undefined;
	public parent_id: string = undefined;
	public group_id: string = undefined;
	public children_posts: PostDto[] = undefined;
	public total_childrens: number = undefined;
	public total_likes: number = undefined;
	public liked: boolean = undefined;

	private constructor(
		id?: string,
		title?: string,
		content?: string,
		attachments?: PostAttachmentDto[],
		creator?: UserDto,
		visibility?: string,
		depth_level?: number,
		thread_id?: string,
		created_at?: string,
		updated_at?: string,
		parent_id?: string,
		group_id?: string,
		children_posts?: PostDto[],
		total_childrens?: number,
		total_likes?: number,
		liked?: boolean,
	) {
		super();
		this.id = id;
		this.title = title;
		this.content = content;
		this.attachments = attachments;
		this.creator = creator;
		this.visibility = visibility;
		this.depth_level = depth_level;
		this.thread_id = thread_id;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.parent_id = parent_id;
		this.group_id = group_id;
		this.children_posts = children_posts;
		this.total_childrens = total_childrens;
		this.total_likes = total_likes;
		this.liked = liked;
	}

	public static fromModel(model: Post): PostDto {
		if (model === null || model === undefined) return null;

		return new PostDto(
			model.id(),
			model.title(),
			model.content(),
			model.attachments().map((a) => PostAttachmentDto.fromModel(a)),
			model.creator() ? UserDto.fromModel(model.creator()).removeSensitiveData() : undefined,
			model.visibility(),
			model.depthLevel(),
			model.thread().id(),
			model.createdAt()?.toISOString(),
			model.updatedAt()?.toISOString(),
			model.parent() ? model.parent().id() : null,
			model.group() ? model.group().id() : null,
			model.childrens().map((p) => PostDto.fromModel(p)),
			model.childrens().length,
			model.totalLikes(),
		);
	}

	public setLiked(liked: boolean): PostDto {
		this.liked = liked;

		return this;
	}
}

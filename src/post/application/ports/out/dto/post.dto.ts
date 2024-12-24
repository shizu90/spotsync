import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { URLService } from 'src/common/web/url.service';
import { GroupDto } from 'src/group/application/ports/out/dto/group.dto';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { Post } from 'src/post/domain/post.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

class PostAttachmentDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public file_path: string = undefined;
	@ApiPropertyOptional()
	public file_type: string = undefined;
	@ApiPropertyOptional()
	public url: string = undefined;

	private constructor(id?: string, file_path?: string, file_type?: string, url?: string) {
		super();
		this.id = id;
		this.file_path = file_path;
		this.file_type = file_type;
		this.url = url;
	}

	public static fromModel(model: PostAttachment): PostAttachmentDto {
		if (model === null || model === undefined) return null;

		return new PostAttachmentDto(
			model.id(),
			model.filePath(),
			model.fileType(),
		);
	}

	public setUrl(url: string): PostAttachmentDto {
		this.url = url;

		return this;
	}
}

export class PostDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public title: string = undefined;
	@ApiPropertyOptional()
	public content: string = undefined;
	@ApiPropertyOptional({ type: [PostAttachmentDto], isArray: true })
	public attachments: PostAttachmentDto[] = undefined;
	@ApiPropertyOptional()
	public creator: UserDto = undefined;
	@ApiPropertyOptional({ enum: PostVisibility })
	public visibility: string = undefined;
	@ApiPropertyOptional()
	public depth_level: number = undefined;
	@ApiPropertyOptional({ example: 'uuid' })
	public thread_id: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public created_at: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public updated_at: string = undefined;
	@ApiPropertyOptional({ type: PostDto })
	public parent: PostDto = undefined;
	@ApiPropertyOptional({ example: 'uuid' })
	public parent_id: string = undefined;
	@ApiPropertyOptional()
	public group: GroupDto = undefined;
	@ApiPropertyOptional()
	public total_replies: number = undefined;
	@ApiPropertyOptional()
	public total_likes: number = undefined;
	@ApiPropertyOptional()
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
		parent?: PostDto,
		parent_id?: string,
		group?: GroupDto,
		total_replies?: number,
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
		this.parent = parent;
		this.parent_id = parent_id;
		this.group = group;
		this.total_replies = total_replies;
		this.total_likes = total_likes;
		this.liked = liked;
	}

	public static fromModel(model: Post): PostDto {
		if (model === null || model === undefined) return null;

		const dto = new PostDto(
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
			model.parent() ? PostDto.fromModel(model.parent()) : null,
			model.parent() ? model.parent().id() : null,
			model.group() ? GroupDto.fromModel(model.group()) : null,
		);

		dto.setAttachmentUrls();

		return dto;
	}

	public setLiked(liked: boolean): PostDto {
		this.liked = liked;

		return this;
	}

	public setTotalLikes(totalLikes: number): PostDto {
		this.total_likes = totalLikes;

		return this;
	}

	public setTotalReplies(totalReplies: number): PostDto {
		this.total_replies = totalReplies;

		return this;
	}

	public setAttachmentUrls(): PostDto {
		const urlService = new URLService();
		
		this.attachments = this.attachments.map((a) => {
			return a.setUrl(
				urlService.generateSignedURL(
					'posts/{postId}/attachments/{attachmentId}',
					{
						postId: this.id,
						attachmentId: a.id,
					}
				)
			);
		});

		return this;
	}
}

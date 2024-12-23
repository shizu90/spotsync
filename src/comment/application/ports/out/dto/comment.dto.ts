import { ApiPropertyOptional } from '@nestjs/swagger';
import { Comment } from 'src/comment/domain/comment.model';
import { CommentableSubject } from 'src/comment/domain/commentable-subject.enum';
import { Dto } from 'src/common/core/common.dto';
import { SpotDto } from 'src/spot/application/ports/out/dto/spot.dto';
import { Spot } from 'src/spot/domain/spot.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

type CommentableDto = SpotDto;

export class CommentDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public text: string = undefined;
	@ApiPropertyOptional()
	public user: UserDto = undefined;
	@ApiPropertyOptional()
	public commentable: CommentableDto = undefined;
	@ApiPropertyOptional()
	public total_likes: number = undefined;
	@ApiPropertyOptional()
	public liked: boolean = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public created_at: string = undefined;

	private constructor(
		id?: string,
		text?: string,
		user?: UserDto,
		commentable?: CommentableDto,
		created_at?: string,
		liked?: boolean,
	) {
		super();
		this.id = id;
		this.text = text;
		this.user = user;
		this.commentable = commentable;
		this.liked = liked;
		this.created_at = created_at;
	}

	public static fromModel(model: Comment): CommentDto {
		if (model === null || model === undefined) return null;

		let commentable: CommentableDto = null;

		if (model.subject() === CommentableSubject.SPOT) {
			commentable = SpotDto.fromModel(model.commentable() as Spot);
		}

		return new CommentDto(
			model.id(),
			model.text(),
			model.user() ? UserDto.fromModel(model.user()).removeSensitiveData() : undefined,
			commentable,
			model.createdAt()?.toISOString(),
			undefined,
		);
	}

	public setLiked(liked: boolean): CommentDto {
		this.liked = liked;
		return this;
	}

	public setTotalLikes(totalLikes: number): CommentDto {
		this.total_likes = totalLikes;
		return this;
	}
}

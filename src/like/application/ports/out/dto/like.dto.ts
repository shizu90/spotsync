import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { Like } from 'src/like/domain/like.model';
import { PostDto } from 'src/post/application/ports/out/dto/post.dto';
import { Post } from 'src/post/domain/post.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

type LikableDto = PostDto;

export class LikeDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public user: UserDto = undefined;
	@ApiProperty()
	public subject: LikableDto = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public created_at: string = undefined;

	private constructor(
		id: string,
		user: UserDto,
		subject: LikableDto,
		created_at: string,
	) {
		super();
		this.id = id;
		this.user = user;
		this.subject = subject;
		this.created_at = created_at;
	}

	public static fromModel(model: Like): LikeDto {
		let subject: LikableDto;

		let likable = model.likable();

		if (likable instanceof Post) {
			subject = PostDto.fromModel(likable);
		} else {
			subject = undefined;
		}

		return new LikeDto(
			model.id(),
			model.user() ? UserDto.fromModel(model.user()).removeSensitiveData() : undefined,
			subject,
			model.createdAt()?.toISOString(),
		);
	}
}

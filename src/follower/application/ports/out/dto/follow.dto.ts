import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { Follow } from 'src/follower/domain/follow.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

export class FollowDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string;
	@ApiProperty()
	public from_user: UserDto = undefined;
	@ApiProperty()
	public to_user: UserDto = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public followed_at: string = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public requested_at: string = undefined;

	private constructor(
		id: string,
		from_user: UserDto,
		to_user: UserDto,
		followed_at: string,
		requested_at: string,
	) {
		super();
		this.id = id;
		this.from_user = from_user;
		this.to_user = to_user;
		this.followed_at = followed_at;
		this.requested_at = requested_at;
	}

	public static fromModel(model: Follow): FollowDto {
		if (model === null || model === undefined) return null;

		return new FollowDto(
			model.id(),
			model.from() ? UserDto.fromModel(model.from()).removeSensitiveData() : undefined,
			model.to() ? UserDto.fromModel(model.to()).removeSensitiveData() : undefined,
			model.followedAt()?.toISOString(),
			model.requestedAt()?.toISOString(),
		);
	}
}

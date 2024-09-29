import { Dto } from 'src/common/core/common.dto';
import { Follow } from 'src/follower/domain/follow.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

export class FollowDto extends Dto {
	public id: string;
	public from_user: UserDto = undefined;
	public to_user: UserDto = undefined;
	public followed_at: string = undefined;
	public requested_at: string = undefined;

	private constructor(
		id: string,
		from_user: UserDto,
		to_user: UserDto,
		followed_at: string,
		requested_at: string
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
			UserDto.fromModel(model.from()),
			UserDto.fromModel(model.to()),
			model.followedAt()?.toISOString(),
			model.requestedAt()?.toISOString()
		);
	}
}

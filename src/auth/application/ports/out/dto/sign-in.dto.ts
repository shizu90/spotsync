import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';
import { User } from 'src/user/domain/user.model';

export class SignInDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public bearer_token: string = undefined;
	@ApiPropertyOptional()
	public user: UserDto = undefined;

	constructor(
		id: string,
		bearer_token: string,
		user: User
	) {
		super();

		this.id = id;
		this.bearer_token = bearer_token;
		this.user = UserDto.fromModel(user);
	}
}

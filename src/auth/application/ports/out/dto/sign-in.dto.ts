import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';

export class SignInDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public name: string = undefined;
	@ApiPropertyOptional()
	public email: string = undefined;
	@ApiPropertyOptional()
	public bearer_token: string = undefined;

	constructor(
		id: string,
		name: string,
		email: string,
		bearer_token: string,
	) {
		super();

		this.id = id;
		this.name = name;
		this.email = email;
		this.bearer_token = bearer_token;
	}
}

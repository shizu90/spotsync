import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class ChangePasswordRequest extends ApiRequest {
	@ApiProperty({
		required: true,
	})
	@IsString()
	public token: string;

	@ApiProperty({ required: true })
	@IsString()
	@MinLength(6)
	@MaxLength(32)
	public password: string;
}

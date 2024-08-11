import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class CreateGroupRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@IsString()
	@MinLength(6)
	@MaxLength(255)
	public name: string;

	@ApiProperty({ required: true })
	@IsString()
	@MaxLength(400)
	public about: string;
}

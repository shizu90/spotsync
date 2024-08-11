import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class UpdateGroupRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MinLength(6)
	@MaxLength(255)
	public name?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MaxLength(400)
	public about?: string;
}

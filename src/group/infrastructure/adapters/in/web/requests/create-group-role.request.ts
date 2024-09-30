import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsHexColor,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class CreateGroupRoleRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	public name: string;

	@ApiProperty({ required: true })
	@IsHexColor()
	public hex_color: string;

	@ApiProperty({ required: true })
	@IsArray()
	@IsUUID(4, { each: true })
	public permissions: string[];
}

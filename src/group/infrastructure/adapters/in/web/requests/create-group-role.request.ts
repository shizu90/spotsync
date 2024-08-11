import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsHexColor,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
	ValidateNested,
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
	@ValidateNested()
	@IsUUID(4)
	public permissions: string[];
}

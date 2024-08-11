import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsHexColor,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class UpdateGroupRoleRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	public name?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsHexColor()
	public hex_color?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsArray()
	@ValidateNested()
	@IsUUID(4)
	public permissions?: string[];
}

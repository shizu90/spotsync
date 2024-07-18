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

export class UpdateGroupRoleRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString({ message: 'Group role name is invalid.' })
	@MinLength(1, {
		message: 'Group role name must have at least 1 character.',
	})
	@MaxLength(255, {
		message: 'Group role name must have less than 255 characters.',
	})
	public name?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsHexColor({
		message: 'Group role hex color is not a valid hexadecimal color.',
	})
	public hex_color?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsArray({ message: 'Group role permissions is invalid.' })
	@ValidateNested({
		each: true,
		message: 'Permission id is not a valid UUIDv4.',
	})
	@IsUUID('4', { message: 'Permission id is not a valid UUIDv4.' })
	public permissions?: string[];
}

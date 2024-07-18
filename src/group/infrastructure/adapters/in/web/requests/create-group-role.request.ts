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

export class CreateGroupRoleRequest {
	@ApiProperty()
	@IsString({ message: 'Group role name is invalid.' })
	@MinLength(1, {
		message: 'Group role name must have at least 1 character.',
	})
	@MaxLength(255, {
		message: 'Group role name must have less than 255 characters.',
	})
	public name: string;

	@ApiProperty()
	@IsHexColor({
		message: 'Group role hex color is not a valid hexadecimal color.',
	})
	public hex_color: string;

	@ApiProperty()
	@IsArray({ message: 'Group role permissions is invalid.' })
	@ValidateNested({
		each: true,
		message: 'Permission id is not a valid UUIDv4.',
	})
	@IsUUID('4', { message: 'Permission id is not a valid UUIDv4.' })
	public permissions: string[];
}

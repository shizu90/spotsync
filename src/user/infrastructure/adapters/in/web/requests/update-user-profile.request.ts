import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsHexColor,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class UpdateUserProfileRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsString({ message: 'First name is invalid' })
	@MaxLength(255, {
		message: 'First name must have less than 255 characters',
	})
	@IsOptional()
	public first_name?: string;

	@ApiProperty({ required: false })
	@IsString({ message: 'Last name is invalid' })
	@MaxLength(255, { message: 'Last name must have less than 255 characters' })
	@IsOptional()
	public last_name?: string;

	@ApiProperty({ required: false })
	@IsHexColor({ message: 'Profile theme color is invalid' })
	@IsOptional()
	public profile_theme_color?: string;

	@ApiProperty({ required: false })
	@IsString({ message: 'Biograph is invalid' })
	@MaxLength(800, { message: 'Biograph must have less than 800 characters' })
	@IsOptional()
	public biograph?: string;

	@ApiProperty({ required: false })
	@IsDateString({}, { message: 'Birth date is invalid' })
	@IsOptional()
	public birth_date?: Date;
}

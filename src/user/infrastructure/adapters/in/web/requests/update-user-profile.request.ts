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
	@IsString()
	@MaxLength(255)
	@IsOptional()
	public first_name?: string;

	@ApiProperty({ required: false })
	@IsString()
	@MaxLength(255)
	@IsOptional()
	public last_name?: string;

	@ApiProperty({ required: false })
	@IsHexColor()
	@IsOptional()
	public profile_theme_color?: string;

	@ApiProperty({ required: false })
	@IsString()
	@MaxLength(800)
	@IsOptional()
	public biograph?: string;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	public birth_date?: Date;
}

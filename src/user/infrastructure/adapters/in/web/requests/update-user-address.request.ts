import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class UpdateUserAddressRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsString()
	@MaxLength(255)
	@MinLength(3)
	@IsOptional()
	public name?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	public area?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	public sub_area?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	public locality?: string;

	@ApiProperty({ required: false })
	@IsString()
	@MaxLength(2)
	@MinLength(2)
	@IsOptional()
	public country_code?: string;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	public main?: boolean;
}

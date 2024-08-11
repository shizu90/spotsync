import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class UpdateUserCredentialsRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsString()
	@MinLength(3)
	@MaxLength(255)
	@IsOptional()
	public name?: string;

	@ApiProperty({ required: false })
	@IsEmail()
	@IsOptional()
	public email?: string;

	@ApiProperty({ required: false })
	@IsString()
	@MinLength(6)
	@MaxLength(32)
	@IsOptional()
	public password?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	public phone_number?: string;
}

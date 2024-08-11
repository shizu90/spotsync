import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class CreateUserRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@IsString()
	@MinLength(3)
	@MaxLength(255)
	public name: string;

	@ApiProperty({ required: true })
	@IsEmail()
	public email: string;

	@ApiProperty({ required: true })
	@IsString()
	@MinLength(6)
	@MaxLength(32)
	public password: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	public phone_number?: string;
}

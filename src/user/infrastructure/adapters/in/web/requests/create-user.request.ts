import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsDateString,
	IsEmail,
	IsNotEmptyObject,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

class Address {
	@ApiProperty({
		required: true,
	})
	@IsString()
	@MaxLength(255)
	public area: string;

	@ApiProperty({
		required: true,
	})
	@IsString()
	@MaxLength(255)
	public sub_area: string;

	@ApiProperty({
		required: true,
	})
	@IsString()
	@MaxLength(2)
	@MinLength(2)
	public country_code: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	@MaxLength(255)
	public locality?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsNumber()
	public latitude?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsNumber()
	public longitude?: number;
}

export class CreateUserRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@MaxLength(10)
	@IsDateString()
	public birth_date: string;

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

	@ApiProperty({ required: false })
	@IsOptional()
	@IsObject()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => Address)
	public address?: Address;
}

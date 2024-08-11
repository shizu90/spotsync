import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	MaxLength,
	ValidateNested,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { SpotType } from 'src/spot/domain/spot-type.enum';

class Address {
	@ApiProperty({
		required: true,
	})
	@IsString()
	public area: string;

	@ApiProperty({
		required: true,
	})
	@IsString()
	public sub_area: string;

	@ApiProperty({
		required: true,
	})
	@IsString()
	public country_code: string;

	@ApiProperty({
		required: false,
	})
	@IsString()
	public locality?: string;

	@ApiProperty({
		required: false,
	})
	@IsNumber()
	public latitude?: number;

	@ApiProperty({
		required: false,
	})
	@IsNumber()
	public longitude?: number;
}

export class UpdateSpotRequest extends ApiRequest {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@MaxLength(255)
	@IsString()
	public name?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@MaxLength(400)
	@IsString()
	public description?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsEnum(SpotType)
	public type?: SpotType;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => Address)
	public address?: Address;
}

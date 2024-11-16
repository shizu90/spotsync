import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsEnum,
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
import { SpotType } from 'src/spot/domain/spot-type.enum';

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
	@IsNumber()
	@IsOptional()
	public longitude?: number;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@MaxLength(10)
	public street_number?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@MaxLength(14)
	public postal_code?: string;
}

export class CreateSpotRequest extends ApiRequest {
	@ApiProperty({
		required: true,
	})
	@MinLength(3)
	@MaxLength(255)
	@IsString()
	public name: string;

	@ApiProperty({
		required: false,
	})
	@MaxLength(400)
	@IsString()
	public description: string;

	@ApiProperty({
		required: true,
	})
	@IsEnum(SpotType)
	public type: SpotType;

	@ApiProperty({
		required: true,
	})
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => Address)
	public address: Address;
}

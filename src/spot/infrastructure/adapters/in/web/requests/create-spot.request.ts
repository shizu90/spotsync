import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsEnum,
	IsNotEmptyObject,
	IsNumber,
	IsObject,
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

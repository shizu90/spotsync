import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ApiRequest } from 'src/common/web/common.request';
import { SpotType } from 'src/spot/domain/spot-type.enum';
import { SpotIncludeObjects } from '../../../out/spot.db';

@ApiQuery({})
export class ListSpotsQueryRequest extends ApiRequest {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	public name?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsEnum(SpotType, { each: true })
	@Type(() => String)
	@Transform(({ value }) => value.split(','))
	public type?: SpotType[];

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsUUID(4)
	public creator_id?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsUUID(4)
	public favorited_by_id?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsUUID(4)
	public visited_by_id?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	public sort?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsEnum(SortDirection)
	public sort_direction?: SortDirection;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsNumber()
	public page?: number = 1;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsNumber()
	public limit?: number = 12;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	public paginate?: boolean;

	@ApiProperty({
		required: false
	})
	@IsOptional()
	@IsArray()
	@IsEnum(SpotIncludeObjects, { each: true })
	@Type(() => String)
	@Transform(({ value }) => value.split(','))
	public include?: string;
}

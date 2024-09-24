import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import {
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
	@IsEnum(SpotType)
	public type?: SpotType;

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
}

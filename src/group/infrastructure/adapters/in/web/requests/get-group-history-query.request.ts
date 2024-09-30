import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ApiRequest } from 'src/common/web/common.request';

@ApiQuery({})
export class GetGroupHistoryQueryRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	public sort?: string;

	@ApiProperty({ required: false, enum: SortDirection })
	@IsOptional()
	@IsEnum(SortDirection)
	public sort_direction?: SortDirection;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	public page?: number = 1;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	public paginate?: boolean;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	public limit?: number = 12;
}

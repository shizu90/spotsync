import { ApiProperty } from '@nestjs/swagger';
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

export class ListThreadsQueryRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4)
	public group_id?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4)
	public user_id?: string;

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

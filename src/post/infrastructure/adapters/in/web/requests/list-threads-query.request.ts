import { ApiProperty } from '@nestjs/swagger';
import {
	IsBooleanString,
	IsEnum,
	IsNumberString,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ApiRequest } from 'src/common/web/common.request';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class ListThreadsQueryRequest extends ApiRequest {
	@ApiProperty({ required: false, enum: PostVisibility })
	@IsOptional()
	@IsEnum(PostVisibility)
	public visibility?: PostVisibility;

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
	@IsNumberString()
	public page?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBooleanString()
	public paginate?: boolean;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumberString()
	public limit?: number;
}

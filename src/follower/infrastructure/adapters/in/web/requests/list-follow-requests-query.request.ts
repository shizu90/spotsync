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

export class ListFollowRequestsQueryRequest extends ApiRequest {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsUUID()
	public from_user_id?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsUUID()
	public to_user_id?: string;

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
	@IsBooleanString()
	public paginate?: boolean;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsNumberString()
	public page?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsNumberString()
	public limit?: number;
}

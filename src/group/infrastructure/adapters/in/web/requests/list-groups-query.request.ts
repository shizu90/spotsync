import { ApiProperty } from '@nestjs/swagger';
import {
	IsBooleanString,
	IsEnum,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ApiRequest } from 'src/common/web/common.request';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';

export class ListGroupsQueryRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	public name?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(GroupVisibility)
	public group_visibility?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	public sort?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(SortDirection)
	public sort_direction?: SortDirection;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBooleanString()
	public paginate?: boolean;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumberString()
	public page?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumberString()
	public limit?: number;
}

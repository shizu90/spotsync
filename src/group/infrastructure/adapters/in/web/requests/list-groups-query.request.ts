import {
	IsBooleanString,
	IsEnum,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';

export class ListGroupsQueryRequest {
	@IsOptional()
	@IsString()
	public name?: string;

	@IsOptional()
	@IsEnum(GroupVisibility)
	public group_visibility?: string;

	@IsOptional()
	@IsString()
	public sort?: string;

	@IsOptional()
	@IsEnum(SortDirection)
	public sort_direction?: SortDirection;

	@IsOptional()
	@IsBooleanString()
	public paginate?: boolean;

	@IsOptional()
	@IsNumberString()
	public page?: number;

	@IsOptional()
	@IsNumberString()
	public limit?: number;
}

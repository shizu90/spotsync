import {
	IsBooleanString,
	IsEnum,
	IsNumberString,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListFollowRequestsQueryRequest {
	@IsOptional()
	@IsUUID()
	public from_user_id?: string;

	@IsOptional()
	@IsUUID()
	public to_user_id?: string;

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

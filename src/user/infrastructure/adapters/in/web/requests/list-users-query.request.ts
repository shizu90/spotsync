import { ApiProperty } from '@nestjs/swagger';
import {
	IsBooleanString,
	IsEnum,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListUsersQueryRequest {
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
	@IsString()
	public first_name?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	public last_name?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	public full_name?: string;

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
	@IsNumberString()
	public page?: number;

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
	public limit?: number;
}

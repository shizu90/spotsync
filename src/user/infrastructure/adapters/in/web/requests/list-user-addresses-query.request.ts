import { ApiProperty } from '@nestjs/swagger';
import {
	IsBooleanString,
	IsEnum,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListUserAddressesQueryRequest {
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
	@IsBooleanString()
	public main?: boolean;

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

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
import { LikableSubject } from 'src/like/domain/likable-subject.enum';

export class ListLikesQueryRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(LikableSubject)
	public subject?: LikableSubject;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4)
	public subject_id?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4)
	public user_id?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumberString()
	public page?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(SortDirection)
	public sort_direction?: SortDirection;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	public sort?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumberString()
	public limit?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBooleanString()
	public paginate?: boolean;
}

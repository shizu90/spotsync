import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { CommentableSubject } from 'src/comment/domain/commentable-subject.enum';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ApiRequest } from 'src/common/web/common.request';

@ApiQuery({})
export class ListCommentsQueryRequest extends ApiRequest {
	@ApiProperty({ required: false, enum: CommentableSubject })
	@IsOptional()
	@IsEnum(CommentableSubject)
	public subject?: CommentableSubject;

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
	@IsString()
	public sort?: string;

	@ApiProperty({ required: false, enum: SortDirection })
	@IsOptional()
	@IsEnum(SortDirection)
	public sort_direction?: SortDirection;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	public page?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	public limit?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	public paginate?: boolean;
}

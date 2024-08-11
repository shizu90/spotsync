import { ApiProperty } from '@nestjs/swagger';
import {
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class CreatePostRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@IsString()
	@MaxLength(400)
	public title: string;

	@ApiProperty()
	@IsString()
	@MaxLength(1255)
	public content: string;

	@ApiProperty({ required: false, enum: PostVisibility })
	@IsOptional()
	@IsEnum(PostVisibility)
	public visibility?: PostVisibility;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4)
	public parent_id?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4)
	public group_id?: string;
}

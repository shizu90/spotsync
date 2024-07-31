import { ApiProperty } from '@nestjs/swagger';
import {
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from 'class-validator';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class CreatePostRequest {
	@ApiProperty()
	@IsString({ message: 'Post title is invalid.' })
	@MaxLength(400, {
		message: 'Post title must have less than 400 characters.',
	})
	public title: string;

	@ApiProperty()
	@IsString({ message: 'Post content is invalid.' })
	@MaxLength(1255, {
		message: 'Post content must have less than 1255 characters.',
	})
	public content: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(PostVisibility, { message: 'Post visibility is invalid.' })
	public visibility?: PostVisibility;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4, { message: 'Parent id is invalid.' })
	public parent_id?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID(4, { message: 'Group id is invalid.' })
	public group_id?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class UpdatePostRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString({ message: 'Post title is invalid.' })
	@MaxLength(400, {
		message: 'Post title must have less than 400 characters.',
	})
	public title: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString({ message: 'Post content is invalid.' })
	@MaxLength(1255, {
		message: 'Post content must have less than 1255 characters.',
	})
	public content: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(PostVisibility, { message: 'Post visibility is invalid.' })
	public visibility?: PostVisibility;
}

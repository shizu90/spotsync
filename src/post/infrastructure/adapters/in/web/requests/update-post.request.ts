import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class UpdatePostRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MaxLength(400)
	public title: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MaxLength(1255)
	public content: string;

	@ApiProperty({ required: false, enum: PostVisibility })
	@IsOptional()
	@IsEnum(PostVisibility)
	public visibility?: PostVisibility;
}

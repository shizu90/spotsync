import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';
import { CommentableSubject } from 'src/comment/domain/comment-subject.model.';
import { ApiRequest } from 'src/common/web/common.request';

export class CreateCommentRequest extends ApiRequest {
	@ApiProperty({ required: true, enum: CommentableSubject })
	@IsEnum(CommentableSubject)
	public subject: CommentableSubject;

	@ApiProperty({ required: true })
	@IsUUID(4)
	public subject_id: string;

	@ApiProperty({ required: true })
	@IsString()
	@MaxLength(400)
	public text: string;
}

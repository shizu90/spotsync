import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';

export class LikeRequest extends ApiRequest {
	@ApiProperty({ required: true, enum: LikableSubject })
	@IsEnum(LikableSubject)
	public subject: LikableSubject;

	@ApiProperty({ required: true })
	@IsUUID(4)
	public subject_id: string;
}

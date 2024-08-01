import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';

export class LikeRequest extends ApiRequest {
	@ApiProperty()
	@IsEnum(LikableSubject, { message: 'Subject is invalid. ' })
	public subject: LikableSubject;

	@ApiProperty()
	@IsUUID(4, { message: 'Subject id is invalid. ' })
	public subject_id: string;
}

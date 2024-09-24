import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class ChangeMemberRoleRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@IsUUID(4)
	public role_id: string;
}

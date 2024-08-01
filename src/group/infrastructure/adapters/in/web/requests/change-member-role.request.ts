import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class ChangeMemberRoleRequest extends ApiRequest {
	@ApiProperty()
	@IsUUID('4', { message: 'Group role id is not a valid UUIDv4.' })
	public role_id: string;
}

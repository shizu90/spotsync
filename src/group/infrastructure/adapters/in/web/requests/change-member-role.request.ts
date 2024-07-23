import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChangeMemberRoleRequest {
	@ApiProperty()
	@IsUUID('4', { message: 'Group role id is not a valid UUIDv4.' })
	public role_id: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';

export class UpdateGroupVisibilityRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(GroupVisibility, {
		message: 'Group visibility must be PUBLIC or PRIVATE.',
	})
	public group_visibility?: GroupVisibility;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(GroupVisibility, {
		message: 'Group post visibility must be PUBLIC or PRIVATE.',
	})
	public post_visibility?: GroupVisibility;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(GroupVisibility, {
		message: 'Group event visibility must be PUBLIC or PRIVATE.',
	})
	public event_visibility?: GroupVisibility;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';

export class UpdateGroupVisibilityRequest {
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

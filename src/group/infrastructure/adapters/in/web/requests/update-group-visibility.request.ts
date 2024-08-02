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
	public groups?: GroupVisibility;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(GroupVisibility, {
		message: 'Group posts visibility must be PUBLIC or PRIVATE.',
	})
	public posts?: GroupVisibility;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(GroupVisibility, {
		message: 'Group spot events visibility must be PUBLIC or PRIVATE.',
	})
	public spot_events?: GroupVisibility;
}

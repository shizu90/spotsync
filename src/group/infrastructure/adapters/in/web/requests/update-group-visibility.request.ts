import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';

export class UpdateGroupVisibilityRequest extends ApiRequest {
	@ApiProperty({ required: false, enum: GroupVisibility })
	@IsOptional()
	@IsEnum(GroupVisibility)
	public groups?: GroupVisibility;

	@ApiProperty({ required: false, enum: GroupVisibility })
	@IsOptional()
	@IsEnum(GroupVisibility)
	public posts?: GroupVisibility;

	@ApiProperty({ required: false, enum: GroupVisibility })
	@IsOptional()
	@IsEnum(GroupVisibility)
	public spot_events?: GroupVisibility;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';

export class UpdateUserVisibilityConfigRequest extends ApiRequest {
	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public profile?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public addresses?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public spot_folders?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public visited_spots?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public posts?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public favorite_spots?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public favorite_spot_folders?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility)
	@IsOptional()
	public favorite_spot_events?: UserVisibility;
}

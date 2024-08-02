import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';

export class UpdateUserVisibilityConfigRequest extends ApiRequest {
	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User profile visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public profile?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User address visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public addresses?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User spot folders visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public spot_folders?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User visited spots visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public visited_spots?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message: 'User posts visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public posts?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User favorite spots visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public favorite_spots?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User favorite spot folders visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public favorite_spot_folders?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User favorite spot events visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public favorite_spot_events?: UserVisibility;
}

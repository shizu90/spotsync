import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';

export class UpdateUserVisibilityConfigRequest {
	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User profile visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public profile_visibility?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User address visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public address_visibility?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User poi folder visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public poi_folder_visibility?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message:
			'User visited poi visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public visited_poi_visibility?: UserVisibility;

	@ApiProperty({ required: false, enum: UserVisibility })
	@IsEnum(UserVisibility, {
		message: 'User post visibility must be PUBLIC, FOLLOWERS or PRIVATE.',
	})
	@IsOptional()
	public post_visibility?: UserVisibility;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { UserAddress } from 'src/user/domain/user-address.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserStatus } from 'src/user/domain/user-status.enum';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { User } from 'src/user/domain/user.model';
import { UserAddressDto } from './user-address.dto';

class UserProfileDto extends Dto {
	@ApiPropertyOptional()
	public display_name: string = undefined;
	@ApiPropertyOptional()
	public biograph: string = undefined;
	@ApiPropertyOptional()
	public profile_picture: string = undefined;
	@ApiPropertyOptional()
	public banner_picture: string = undefined;
	@ApiPropertyOptional()
	public birth_date: string = undefined;
	@ApiPropertyOptional()
	public theme_color: string = undefined;
	@ApiPropertyOptional({ example: UserVisibility })
	public visibility: string = undefined;

	constructor(
		display_name?: string,
		biograph?: string,
		profile_picture?: string,
		banner_picture?: string,
		birth_date?: string,
		theme_color?: string,
		visibility?: string,
	) {
		super();
		this.display_name = display_name;
		this.biograph = biograph;
		this.profile_picture = profile_picture;
		this.banner_picture = banner_picture;
		this.birth_date = birth_date;
		this.theme_color = theme_color;
		this.visibility = visibility;
	}

	public static fromModel(model: UserProfile): UserProfileDto {
		return new UserProfileDto(
			model.displayName(),
			model.biograph(),
			model.profilePicture(),
			model.bannerPicture(),
			model.birthDate()?.toISOString().split('T')[0],
			model.themeColor(),
			model.visibility(),
		);
	}
}

class UserCredentialsDto extends Dto {
	@ApiPropertyOptional()
	public name: string = undefined;
	@ApiPropertyOptional()
	public email: string = undefined;
	@ApiPropertyOptional()
	public password: string = undefined;
	@ApiPropertyOptional()
	public phone_number: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public last_login: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public last_logout: string = undefined;

	constructor(
		name?: string,
		email?: string,
		password?: string,
		phone_number?: string,
		last_login?: string,
		last_logout?: string,
	) {
		super();
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone_number = phone_number;
		this.last_login = last_login;
		this.last_logout = last_logout;
	}

	public static fromModel(model: UserCredentials): UserCredentialsDto {
		return new UserCredentialsDto(
			model.name(),
			model.email(),
			model.password(),
			model.phoneNumber(),
			model.lastLogin()?.toISOString(),
			model.lastLogout()?.toISOString(),
		);
	}

	public removeSensitiveData(): UserCredentialsDto {
		this.password = undefined;
		this.email = undefined;
		this.phone_number = undefined;

		return this;
	}
}

class UserVisibilitySettingsDto extends Dto {
	@ApiPropertyOptional({ enum: UserVisibility })
	public profile: string = undefined;
	@ApiPropertyOptional({ enum: UserVisibility })
	public addresses: string = undefined;
	@ApiPropertyOptional({ enum: UserVisibility })
	public visited_spots: string = undefined;
	@ApiPropertyOptional({ enum: UserVisibility })
	public posts: string = undefined;
	@ApiPropertyOptional({ enum: UserVisibility })
	public favorite_spots: string = undefined;
	@ApiPropertyOptional({ enum: UserVisibility })
	public favorite_spot_events: string = undefined;
	@ApiPropertyOptional({ enum: UserVisibility })
	public favorite_spot_folders: string = undefined;
	@ApiPropertyOptional({ enum: UserVisibility })
	public spot_folders: string = undefined;

	constructor(
		profile?: string,
		addresses?: string,
		visited_spots?: string,
		posts?: string,
		favorite_spots?: string,
		favorite_spot_events?: string,
		favorite_spot_folders?: string,
		spot_folders?: string,
	) {
		super();
		this.profile = profile;
		this.addresses = addresses;
		this.visited_spots = visited_spots;
		this.posts = posts;
		this.favorite_spots = favorite_spots;
		this.favorite_spot_events = favorite_spot_events;
		this.favorite_spot_folders = favorite_spot_folders;
		this.spot_folders = spot_folders;
	}

	public static fromModel(
		model: UserVisibilitySettings,
	): UserVisibilitySettingsDto {
		return new UserVisibilitySettingsDto(
			model.profile(),
			model.addresses(),
			model.visitedSpots(),
			model.posts(),
			model.favoriteSpots(),
			model.favoriteSpotEvents(),
			model.favoriteSpotFolders(),
			model.spotFolders(),
		);
	}
}

export class UserDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional({ enum: UserStatus })
	public status: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public created_at: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public updated_at: string = undefined;
	@ApiPropertyOptional()
	public credentials: UserCredentialsDto = undefined;
	@ApiPropertyOptional()
	public profile: UserProfileDto = undefined;
	@ApiPropertyOptional()
	public visibility_settings: UserVisibilitySettingsDto = undefined;
	@ApiPropertyOptional()
	public main_address: UserAddressDto = undefined;
	@ApiPropertyOptional()
	public total_followers: number = undefined;
	@ApiPropertyOptional()
	public total_following: number = undefined;
	@ApiPropertyOptional()
	public following: boolean = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public followed_at: string = undefined;
	@ApiPropertyOptional()
	public requested_to_follow: boolean = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public requested_to_follow_at: string = undefined;

	constructor(
		id?: string,
		status?: string,
		created_at?: string,
		updated_at?: string,
		credentials?: UserCredentialsDto,
		profile?: UserProfileDto,
		visibility_settings?: UserVisibilitySettingsDto,
		main_address?: UserAddressDto,
		total_followers?: number,
		total_following?: number,
		following?: boolean,
		followed_at?: string,
		requested_to_follow?: boolean,
		requested_to_follow_at?: string,
	) {
		super();
		this.id = id;
		this.status = status;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.credentials = credentials;
		this.profile = profile;
		this.visibility_settings = visibility_settings;
		this.main_address = main_address;
		this.total_followers = total_followers;
		this.total_following = total_following;
		this.following = following;
		this.followed_at = followed_at;
		this.requested_to_follow = requested_to_follow;
		this.requested_to_follow_at = requested_to_follow_at;
	}

	public static fromModel(model: User): UserDto {
		if (model === null || model === undefined) return null;

		return new UserDto(
			model.id(),
			model.status(),
			model.createdAt()?.toISOString(),
			model.updatedAt()?.toISOString(),
			UserCredentialsDto.fromModel(model.credentials()),
			UserProfileDto.fromModel(model.profile()),
			UserVisibilitySettingsDto.fromModel(model.visibilitySettings()),
		);
	}

	public removeSensitiveData(): UserDto {
		this.credentials = this.credentials.removeSensitiveData();

		return this;
	}

	public setMainAddress(mainAddress: UserAddress): UserDto {
		this.main_address = UserAddressDto.fromModel(mainAddress);

		return this;
	}

	public setTotalFollowers(totalFollowers: number): UserDto {
		this.total_followers = totalFollowers;

		return this;
	}

	public setTotalFollowing(totalFollowing: number): UserDto {
		this.total_following = totalFollowing;

		return this;
	}

	public setFollowedAt(followed_at: Date): UserDto {
		this.followed_at = followed_at?.toISOString();
		this.following = followed_at !== null && followed_at !== undefined;

		return this;
	}

	public setRequestedToFollowAt(requested_to_follow_at: Date): UserDto {
		this.requested_to_follow_at = requested_to_follow_at?.toISOString();
		this.requested_to_follow =
			requested_to_follow_at !== null &&
			requested_to_follow_at !== undefined;

		return this;
	}
}

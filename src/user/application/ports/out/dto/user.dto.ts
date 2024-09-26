import { Dto } from "src/common/core/common.dto";
import { UserAddress } from "src/user/domain/user-address.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserProfile } from "src/user/domain/user-profile.model";
import { UserVisibilitySettings } from "src/user/domain/user-visibility-settings.model";
import { User } from "src/user/domain/user.model";
import { UserAddressDto } from "./user-address.dto";

class UserProfileDto extends Dto {
    public display_name: string = undefined;
    public biograph: string = undefined;
    public profile_picture: string = undefined;
    public banner_picture: string = undefined;
    public birth_date: string = undefined;
    public theme_color: string = undefined;
    public visibility: string = undefined;

    constructor(
        display_name?: string,
        biograph?: string,
        profile_picture?: string,
        banner_picture?: string,
        birth_date?: string,
        theme_color?: string,
        visibility?: string
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
    public name: string = undefined;
    public email: string = undefined;
    public password: string = undefined;
    public phone_number: string = undefined;
    public last_login: string = undefined;
    public last_logout: string = undefined;

    constructor(
        name?: string,
        email?: string,
        password?: string,
        phone_number?: string,
        last_login?: string,
        last_logout?: string
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
    public profile: string = undefined;
    public addresses: string = undefined;
    public visited_spots: string = undefined;
    public posts: string = undefined;
    public favorite_spots: string = undefined;
    public favorite_spot_events: string = undefined;
    public favorite_spot_folders: string = undefined;
    public spot_folders: string = undefined;

    constructor(
        profile?: string,
        addresses?: string,
        visited_spots?: string,
        posts?: string,
        favorite_spots?: string,
        favorite_spot_events?: string,
        favorite_spot_folders?: string,
        spot_folders?: string
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

    public static fromModel(model: UserVisibilitySettings): UserVisibilitySettingsDto {
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
    public id: string = undefined;
    public status: string = undefined;
    public created_at: string = undefined;
    public updated_at: string = undefined;
    public credentials: UserCredentialsDto = undefined;
    public profile: UserProfileDto = undefined;
    public visibility_settings: UserVisibilitySettingsDto = undefined;
    public main_address: UserAddressDto = undefined;
    public total_followers: number = undefined;
    public total_following: number = undefined;
    public following: boolean = undefined;

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
        following?: boolean
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
    }

    public static fromModel(model: User): UserDto {
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

    public setFollowing(following: boolean): UserDto {
        this.following = following;

        return this;
    }
}
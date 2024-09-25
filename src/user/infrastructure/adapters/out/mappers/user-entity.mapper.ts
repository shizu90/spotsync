import { UserCredentials as UserCredentialsPrisma, User as UserPrisma, UserProfile as UserProfilePrisma, UserVisibilitySettings as UserVisibilitySettingsPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserProfile } from "src/user/domain/user-profile.model";
import { UserStatus } from "src/user/domain/user-status.enum";
import { UserVisibilitySettings } from "src/user/domain/user-visibility-settings.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { User } from "src/user/domain/user.model";

export type UserEntity = UserPrisma & {profile?: UserProfilePrisma, credentials?: UserCredentialsPrisma, visibility_settings?: UserVisibilitySettingsPrisma};

export class UserEntityMapper implements EntityMapper<User, UserEntity> {
    public toEntity(model: User): UserEntity {
        return {
            id: model.id(),
            created_at: model.createdAt(),
            updated_at: model.updatedAt(),
            is_deleted: model.isDeleted(),
            status: model.status(),
            profile: model.profile() ? {
                user_id: model.id(),
                display_name: model.profile().displayName(),
                birth_date: model.profile().birthDate(),
                banner_picture: model.profile().bannerPicture(),
                profile_picture: model.profile().profilePicture(),
                biograph: model.profile().biograph(),
                theme_color: model.profile().themeColor(),
                visibility: model.profile().visibility(),
            } : null,
            credentials: model.credentials() ? {
                user_id: model.id(),
                email: model.credentials().email(),
                password: model.credentials().password(),
                name: model.credentials().name(),
                last_login: model.credentials().lastLogin(),
                last_logout: model.credentials().lastLogout(),
                phone_number: model.credentials().phoneNumber(),
            } : null,
            visibility_settings: model.visibilitySettings() ? {
                addresses: model.visibilitySettings().addresses(),
                favorite_spot_events: model.visibilitySettings().favoriteSpotEvents(),
                favorite_spot_folders: model.visibilitySettings().favoriteSpotFolders(),
                favorite_spots: model.visibilitySettings().favoriteSpots(),
                posts: model.visibilitySettings().posts(),
                profile: model.visibilitySettings().profile(),
                spot_folders: model.visibilitySettings().spotFolders(),
                user_id: model.id(),
                visited_spots: model.visibilitySettings().visitedSpots(),
            } : null
        };
    }

    public toModel(entity: UserEntity): User {
        return User.create(
            entity.id,
            entity.profile ? UserProfile.create(
                entity.id,
                entity.profile.birth_date,
                entity.profile.display_name,
                entity.profile.theme_color,
                entity.profile.profile_picture,
                entity.profile.banner_picture,
                entity.profile.biograph,
                entity.profile.visibility as UserVisibility,
            ) : null,
            entity.credentials ? UserCredentials.create(
                entity.id,
                entity.credentials.name,
                entity.credentials.email,
                entity.credentials.password,
                entity.credentials.phone_number,
                entity.credentials.last_login,
                entity.credentials.last_logout,
            ) : null,
            entity.visibility_settings ? UserVisibilitySettings.create(
                entity.id,
                entity.visibility_settings.profile as UserVisibility,
                entity.visibility_settings.addresses as UserVisibility,
                entity.visibility_settings.spot_folders as UserVisibility,
                entity.visibility_settings.visited_spots as UserVisibility,
                entity.visibility_settings.posts as UserVisibility,
                entity.visibility_settings.favorite_spots as UserVisibility,
                entity.visibility_settings.favorite_spot_folders as UserVisibility,
                entity.visibility_settings.favorite_spot_events as UserVisibility,
            ) : null,
            entity.status as UserStatus,
            entity.created_at,
            entity.updated_at,
            entity.is_deleted
        );
    }
}
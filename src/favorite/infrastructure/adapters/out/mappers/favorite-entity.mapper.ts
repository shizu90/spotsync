import { Favorite as FavoritePrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { Favoritable } from "src/favorite/domain/favoritable.interface";
import { Favorite } from "src/favorite/domain/favorite.model";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { SpotFolderEntity, SpotFolderEntityMapper } from "src/spot-folder/infrastructure/adapters/out/mappers/spot-folder-entity.mapper";
import { Spot } from "src/spot/domain/spot.model";
import { SpotEntity, SpotEntityMapper } from "src/spot/infrastructure/adapters/out/mappers/spot-entity.mapper";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type FavoriteEntity = FavoritePrisma & {user?: UserEntity, spot?: SpotEntity, spot_folder?: SpotFolderEntity};

export class FavoriteEntityMapper implements EntityMapper<Favorite, FavoriteEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();
    private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();
    private _spotFolderEntityMapper: SpotFolderEntityMapper = new SpotFolderEntityMapper();

    public toEntity(model: Favorite): FavoriteEntity {
        return {
            id: model.id(),
            created_at: model.createdAt(),
            subject: model.favoritableSubject(),
            spot_id: (model.favoritableSubject() === FavoritableSubject.SPOT && model.favoritable()) ? model.favoritable().id() : null,
            spot_folder_id: (model.favoritableSubject() === FavoritableSubject.SPOT_FOLDER && model.favoritable()) ? model.favoritable().id() : null,
            spot_event_id: (model.favoritableSubject() === FavoritableSubject.SPOT_EVENT && model.favoritable()) ? model.favoritable().id() : null,
            user_id: model.user() ? model.user().id() : null,
            spot: (model.favoritableSubject() === FavoritableSubject.SPOT && model.favoritable()) ? this._spotEntityMapper.toEntity(model.favoritable() as Spot) : null,
            spot_folder: (model.favoritableSubject() === FavoritableSubject.SPOT_FOLDER && model.favoritable()) ? this._spotFolderEntityMapper.toEntity(model.favoritable() as SpotFolder) : null,
            user: model.user() ? this._userEntityMapper.toEntity(model.user()) : null,
        };
    }

    public toModel(entity: FavoriteEntity): Favorite {
        let favoritable: Favoritable;

        switch(entity.subject) {
            case FavoritableSubject.SPOT.toString():
                favoritable = entity.spot ? this._spotEntityMapper.toModel(entity.spot) : null;
                break;
            case FavoritableSubject.SPOT_FOLDER.toString():
                favoritable = entity.spot_folder ? this._spotFolderEntityMapper.toModel(entity.spot_folder) : null;
                break;
            default: break;
        }

        return Favorite.create(
            entity.id,
            entity.user ? this._userEntityMapper.toModel(entity.user) : null,
            entity.subject as FavoritableSubject,
            favoritable,
            entity.created_at,
        );
    }
}
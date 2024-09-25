import { SpotFolderItem as SpotFolderItemPrisma, SpotFolder as SpotFolderPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { SpotFolderItem } from "src/spot-folder/domain/spot-folder-item.model";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { SpotEntity, SpotEntityMapper } from "src/spot/infrastructure/adapters/out/mappers/spot-entity.mapper";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type SpotFolderEntity = SpotFolderPrisma & {creator?: UserEntity, spots?: (SpotFolderItemPrisma & {spot?: SpotEntity})[] };

export class SpotFolderEntityMapper implements EntityMapper<SpotFolder, SpotFolderEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();
    private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();

    public toEntity(model: SpotFolder): SpotFolderEntity {
        return {
            id: model.id(),
            name: model.name(),
            description: model.description(),
            hex_color: model.hexColor(),
            visibility: model.visibility(),
            created_at: model.createdAt(),
            updated_at: model.updatedAt(),
            user_id: model.creator() ? model.creator().id() : null,
            creator: model.creator() ? this._userEntityMapper.toEntity(model.creator()) : null,
            spots: model.items() ? model.items().map(item => ({
                added_at: item.addedAt(),
                order_number: item.orderNumber(),
                spot_folder_id: model.id(),
                spot_id: item.spot() ? item.spot().id() : null,
                spot: item.spot() ? this._spotEntityMapper.toEntity(item.spot()) : null
            })) : [],
        };
    }

    public toModel(entity: SpotFolderEntity): SpotFolder {
        return SpotFolder.create(
            entity.id,
            entity.name,
            entity.description,
            entity.hex_color,
            entity.visibility as SpotFolderVisibility,
            entity.creator ? this._userEntityMapper.toModel(entity.creator) : null,
            entity.spots ? entity.spots.map(item => SpotFolderItem.create(
                item.spot ? this._spotEntityMapper.toModel(item.spot) : null,
                item.order_number,
                item.added_at,
            )) : [],
            entity.created_at,
            entity.updated_at,
        );
    }
}
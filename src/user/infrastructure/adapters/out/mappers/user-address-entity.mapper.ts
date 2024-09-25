import { UserAddress as UserAddressPrisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { EntityMapper } from "src/common/core/entity.mapper";
import { UserAddress } from "src/user/domain/user-address.model";
import { UserEntity, UserEntityMapper } from "./user-entity.mapper";


export type UserAddressEntity = UserAddressPrisma & {user?: UserEntity};

export class UserAddressEntityMapper implements EntityMapper<UserAddress, UserAddressEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

    public toEntity(model: UserAddress): UserAddressEntity {     
        return {
            id: model.id(),
            area: model.area(),
            country_code: model.countryCode(),
            created_at: model.createdAt(),
            is_deleted : model.isDeleted(),
            latitude: new Decimal(model.latitude()),
            locality: model.locality(),
            longitude: new Decimal(model.longitude()),
            main: model.main(),
            name: model.name(),
            sub_area: model.subArea(),
            updated_at: model.updatedAt(),
            user_id: model.user() ? model.user().id() : null,
            user: model.user() ? this._userEntityMapper.toEntity(model.user()) : null
        };
    }
    
    public toModel(entity: UserAddressEntity): UserAddress {
        return UserAddress.create(
            entity.id,
            entity.name,
            entity.area,
            entity.sub_area,
            entity.locality,
            entity.latitude.toNumber(),
            entity.longitude.toNumber(),
            entity.country_code,
            entity.main,
            entity.user ? this._userEntityMapper.toModel(entity.user) : null,
            entity.created_at,
            entity.updated_at,
            entity.is_deleted,
        );
    }
}
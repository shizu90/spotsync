import { Like as LikePrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { Like } from "src/like/domain/like.model";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type LikeEntity = LikePrisma & {user?: UserEntity, post?: any, comment?: any};

export class LikeEntityMapper implements EntityMapper<Like, LikeEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

    public static toModel(like: LikeEntity): Like {
        return Like.create(
            like.id,
            like.likable_subject,
        );
    }

    public toEntity(like: Like): LikeEntity {

    }
}
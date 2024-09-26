import { Like as LikePrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { LikableSubject } from "src/like/domain/likable-subject.enum";
import { Likable } from "src/like/domain/likable.interface";
import { Like } from "src/like/domain/like.model";
import { Post } from "src/post/domain/post.model";
import { PostEntity, PostEntityMapper } from "src/post/infrastructure/adapters/out/mappers/post-entity.mapper";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type LikeEntity = LikePrisma & {user?: UserEntity, post?: PostEntity, comment?: any};

export class LikeEntityMapper implements EntityMapper<Like, LikeEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();
    private _postEntityMapper: PostEntityMapper = new PostEntityMapper();
    
    public toEntity(like: Like): LikeEntity {
        if (like === null || like === undefined) return null;

        return {
            id: like.id(),
            likable_subject: like.likableSubject(),
            created_at: like.createdAt(),
            post_id: like.likableSubject() === LikableSubject.POST ? like.likable()?.id() : null,
            comment_id: like.likableSubject() === LikableSubject.COMMENT ? like.likable()?.id() : null,
            user_id: like.user() ? like.user().id() : null,
            comment: null,
            post: (like.likableSubject() === LikableSubject.POST && like.likable()) ? this._postEntityMapper.toEntity(like.likable() as Post) : null,
            user: like.user() ? this._userEntityMapper.toEntity(like.user()) : null,
        };
    }

    public toModel(entity: LikeEntity): Like {
        if (entity === null || entity === undefined) return null;

        let likable: Likable;

        switch(entity.likable_subject) {
            case LikableSubject.POST.toString():
                likable = entity.post ? this._postEntityMapper.toModel(entity.post) : null;
                break;
            default: break;
        }
        
        return Like.create(
            entity.id,
            entity.likable_subject as LikableSubject,
            likable,
            entity.user ? this._userEntityMapper.toModel(entity.user) : null,
            entity.created_at,
        );
    }

}
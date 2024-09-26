import { PostThread as PostThreadPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { PostThread } from "src/post/domain/post-thread.model";

export type PostThreadEntity = PostThreadPrisma;

export class PostThreadEntityMapper implements EntityMapper<PostThread, PostThreadEntity> {
    public toEntity(model: PostThread): PostThreadEntity {
        if (model === null || model === undefined) return null;

        return {
            id: model.id(),
            max_depth_level: model.maxDepthLevel(),
        };
    }

    public toModel(entity: PostThreadEntity): PostThread {
        if (entity === null || entity === undefined) return null;

        return PostThread.create(
            entity.id,
            entity.max_depth_level,
        );
    }
}
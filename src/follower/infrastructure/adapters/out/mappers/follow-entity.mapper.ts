import { Follow as FollowPrisma } from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';
import { Follow } from 'src/follower/domain/follow.model';
import {
	UserEntity,
	UserEntityMapper,
} from 'src/user/infrastructure/adapters/out/mappers/user-entity.mapper';

export type FollowEntity = FollowPrisma & {
	from_user?: UserEntity;
	to_user?: UserEntity;
};

export class FollowEntityMapper implements EntityMapper<Follow, FollowEntity> {
	private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

	public toEntity(model: Follow): FollowEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			followed_at: model.followedAt(),
			requested_at: model.requestedAt(),
			status: model.status(),
			from_user_id: model.from() ? model.from().id() : null,
			to_user_id: model.to() ? model.to().id() : null,
			from_user: model.from()
				? this._userEntityMapper.toEntity(model.from())
				: null,
			to_user: model.to()
				? this._userEntityMapper.toEntity(model.to())
				: null,
		};
	}

	public toModel(entity: FollowEntity): Follow {
		if (entity === null || entity === undefined) return null;

		return Follow.create(
			entity.id,
			entity.from_user
				? this._userEntityMapper.toModel(entity.from_user)
				: null,
			entity.to_user
				? this._userEntityMapper.toModel(entity.to_user)
				: null,
			entity.status as FollowStatus,
			entity.followed_at,
			entity.requested_at,
		);
	}
}

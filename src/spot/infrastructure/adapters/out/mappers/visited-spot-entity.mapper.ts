import { VisitedSpot as VisitedSpotPrisma } from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { VisitedSpot } from 'src/spot/domain/visited-spot.model';
import {
	UserEntity,
	UserEntityMapper,
} from 'src/user/infrastructure/adapters/out/mappers/user-entity.mapper';
import { SpotEntity, SpotEntityMapper } from './spot-entity.mapper';

export type VisitedSpotEntity = VisitedSpotPrisma & {
	spot?: SpotEntity;
	user?: UserEntity;
};

export class VisitedSpotEntityMapper
	implements EntityMapper<VisitedSpot, VisitedSpotEntity>
{
	private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();
	private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

	public toEntity(model: VisitedSpot): VisitedSpotEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			spot_id: model.spot() ? model.spot().id() : null,
			user_id: model.user() ? model.user().id() : null,
			visited_at: model.visitedAt(),
			spot: model.spot()
				? this._spotEntityMapper.toEntity(model.spot())
				: null,
			user: model.user()
				? this._userEntityMapper.toEntity(model.user())
				: null,
		};
	}

	public toModel(entity: VisitedSpotEntity): VisitedSpot {
		if (entity === null || entity === undefined) return null;

		return VisitedSpot.create(
			entity.id,
			entity.spot ? this._spotEntityMapper.toModel(entity.spot) : null,
			entity.user ? this._userEntityMapper.toModel(entity.user) : null,
			entity.visited_at,
		);
	}
}

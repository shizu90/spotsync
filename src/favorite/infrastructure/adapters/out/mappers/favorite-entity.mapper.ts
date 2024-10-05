import { Favorite as FavoritePrisma } from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';
import { Favoritable } from 'src/favorite/domain/favoritable.interface';
import { Favorite } from 'src/favorite/domain/favorite.model';
import { SpotEvent } from 'src/spot-event/domain/spot-event.model';
import { SpotEventEntity, SpotEventEntityMapper } from 'src/spot-event/infrastructure/adapters/out/mappers/spot-event-entity.mapper';
import { SpotFolder } from 'src/spot-folder/domain/spot-folder.model';
import {
	SpotFolderEntity,
	SpotFolderEntityMapper,
} from 'src/spot-folder/infrastructure/adapters/out/mappers/spot-folder-entity.mapper';
import { Spot } from 'src/spot/domain/spot.model';
import {
	SpotEntity,
	SpotEntityMapper,
} from 'src/spot/infrastructure/adapters/out/mappers/spot-entity.mapper';
import {
	UserEntity,
	UserEntityMapper,
} from 'src/user/infrastructure/adapters/out/mappers/user-entity.mapper';

export type FavoriteEntity = FavoritePrisma & {
	user?: UserEntity;
	spot?: SpotEntity;
	spot_folder?: SpotFolderEntity;
	spot_event?: SpotEventEntity;
};

export class FavoriteEntityMapper
	implements EntityMapper<Favorite, FavoriteEntity>
{
	private _userEntityMapper: UserEntityMapper = new UserEntityMapper();
	private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();
	private _spotFolderEntityMapper: SpotFolderEntityMapper =
		new SpotFolderEntityMapper();
	private _spotEventEntityMapper: SpotEventEntityMapper = new SpotEventEntityMapper();

	public toEntity(model: Favorite): FavoriteEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			created_at: model.createdAt(),
			subject: model.subject(),
			spot_id:
				model.subject() === FavoritableSubject.SPOT &&
				model.favoritable()
					? model.favoritable().id()
					: null,
			spot_folder_id:
				model.subject() === FavoritableSubject.SPOT_FOLDER &&
				model.favoritable()
					? model.favoritable().id()
					: null,
			spot_event_id:
				model.subject() === FavoritableSubject.SPOT_EVENT &&
				model.favoritable()
					? model.favoritable().id()
					: null,
			user_id: model.user() ? model.user().id() : null,
			spot:
				model.subject() === FavoritableSubject.SPOT &&
				model.favoritable()
					? this._spotEntityMapper.toEntity(
							model.favoritable() as Spot,
						)
					: null,
			spot_folder:
				model.subject() === FavoritableSubject.SPOT_FOLDER &&
				model.favoritable()
					? this._spotFolderEntityMapper.toEntity(
							model.favoritable() as SpotFolder,
						)
					: null,
			spot_event:
				model.subject() === FavoritableSubject.SPOT_EVENT &&
				model.favoritable()
					? this._spotEventEntityMapper.toEntity(
							model.favoritable() as SpotEvent,
						)
					: null,
			user: model.user()
				? this._userEntityMapper.toEntity(model.user())
				: null,
		};
	}

	public toModel(entity: FavoriteEntity): Favorite {
		if (entity === null || entity === undefined) return null;

		let favoritable: Favoritable;

		switch (entity.subject) {
			case FavoritableSubject.SPOT.toString():
				favoritable = entity.spot
					? this._spotEntityMapper.toModel(entity.spot)
					: null;
				break;
			case FavoritableSubject.SPOT_FOLDER.toString():
				favoritable = entity.spot_folder
					? this._spotFolderEntityMapper.toModel(entity.spot_folder)
					: null;
				break;
			case FavoritableSubject.SPOT_EVENT.toString():
				favoritable = entity.spot_event
					? this._spotEventEntityMapper.toModel(entity.spot_event)
					: null;
			default:
				break;
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

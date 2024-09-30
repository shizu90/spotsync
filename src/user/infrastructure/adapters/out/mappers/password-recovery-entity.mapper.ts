import { PasswordRecovery as PasswordRecoveryPrisma } from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { PasswordRecoveryStatus } from 'src/user/domain/password-recovery-status.enum';
import { PasswordRecovery } from 'src/user/domain/password-recovery.model';
import { UserEntity, UserEntityMapper } from './user-entity.mapper';

export type PasswordRecoveryEntity = PasswordRecoveryPrisma & {
	user?: UserEntity;
};

export class PasswordRecoveryEntityMapper
	implements EntityMapper<PasswordRecovery, PasswordRecoveryEntity>
{
	private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

	public toEntity(model: PasswordRecovery): PasswordRecoveryEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			created_at: model.createdAt(),
			expires_at: model.expiresAt(),
			status: model.status(),
			token: model.token(),
			user_id: model.user() ? model.user().id() : null,
			user: model.user()
				? this._userEntityMapper.toEntity(model.user())
				: null,
		};
	}

	public toModel(entity: PasswordRecoveryEntity): PasswordRecovery {
		if (entity === null || entity === undefined) return null;

		return PasswordRecovery.create(
			entity.id,
			entity.user ? this._userEntityMapper.toModel(entity.user) : null,
			entity.status as PasswordRecoveryStatus,
			entity.token,
			entity.created_at,
			entity.expires_at,
		);
	}
}

import {
	SpotAddress as SpotAddressPrisma,
	SpotAttachment as SpotAttachmentPrisma,
	Spot as SpotPrisma,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { SpotAddress } from 'src/spot/domain/spot-address.model';
import { SpotAttachment } from 'src/spot/domain/spot-attachment.model';
import { SpotType } from 'src/spot/domain/spot-type.enum';
import { Spot } from 'src/spot/domain/spot.model';
import {
	UserEntity,
	UserEntityMapper,
} from 'src/user/infrastructure/adapters/out/mappers/user-entity.mapper';

export type SpotEntity = SpotPrisma & {
	creator?: UserEntity;
	address?: SpotAddressPrisma;
	attachments?: SpotAttachmentPrisma[];
};

export class SpotEntityMapper implements EntityMapper<Spot, SpotEntity> {
	private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

	public toEntity(model: Spot): SpotEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			name: model.name(),
			type: model.type(),
			created_at: model.createdAt(),
			updated_at: model.updatedAt(),
			creator_id: model.creator() ? model.creator().id() : null,
			description: model.description(),
			is_deleted: model.isDeleted(),
			address: model.address()
				? {
						spot_id: model.id(),
						area: model.address().area(),
						country_code: model.address().countryCode(),
						locality: model.address().locality(),
						sub_area: model.address().subArea(),
						latitude: new Decimal(model.address().latitude()),
						longitude: new Decimal(model.address().longitude()),
						postal_code: model.address().postalCode(),
						street_number: model.address().streetNumber(),
					}
				: null,
			creator: model.creator()
				? this._userEntityMapper.toEntity(model.creator())
				: null,
			attachments: model.attachments().map((attachment) => {
				return {
					id: attachment.id(),
					spot_id: model.id(),
					file_path: attachment.filePath(),
					file_type: attachment.fileType(),
				};
			}),
		};
	}

	public toModel(entity: SpotEntity): Spot {
		if (entity === null || entity === undefined) return null;

		return Spot.create(
			entity.id,
			entity.name,
			entity.description,
			entity.type as SpotType,
			entity.address
				? SpotAddress.create(
						entity.id,
						entity.address.area,
						entity.address.sub_area,
						entity.address.latitude.toNumber(),
						entity.address.longitude.toNumber(),
						entity.address.country_code,
						entity.address.locality,
						entity.address.street_number,
						entity.address.postal_code,
					)
				: null,
			entity.attachments ? entity.attachments.map((attachment) =>
				SpotAttachment.create(attachment.id, attachment.file_path, attachment.file_type),
			) : [],
			entity.creator
				? this._userEntityMapper.toModel(entity.creator)
				: null,
			entity.created_at,
			entity.updated_at,
			entity.is_deleted,
		);
	}
}

import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';
import { Favorite } from 'src/favorite/domain/favorite.model';
import { SpotFolderDto } from 'src/spot-folder/application/ports/out/dto/spot-folder.dto';
import { SpotFolder } from 'src/spot-folder/domain/spot-folder.model';
import { SpotDto } from 'src/spot/application/ports/out/dto/spot.dto';
import { Spot } from 'src/spot/domain/spot.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

type FavoritableDto = SpotDto | SpotFolderDto;

export class FavoriteDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public user: UserDto = undefined;
	@ApiProperty()
	public subject: FavoritableDto = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public created_at: string = undefined;

	private constructor(
		id: string,
		user: UserDto,
		subject: FavoritableDto,
		created_at: string,
	) {
		super();
		this.id = id;
		this.user = user;
		this.subject = subject;
		this.created_at = created_at;
	}

	public static fromModel(model: Favorite): FavoriteDto {
		if (model === null || model === undefined) return null;

		let favoritable: FavoritableDto;

		let subject = model.subject();

		if (subject === FavoritableSubject.SPOT) {
			favoritable = SpotDto.fromModel(model.favoritable() as Spot);
		} else if (subject === FavoritableSubject.SPOT_FOLDER) {
			favoritable = SpotFolderDto.fromModel(
				model.favoritable() as SpotFolder,
			);
		} else {
			favoritable = undefined;
		}

		return new FavoriteDto(
			model.id(),
			model.user() ? UserDto.fromModel(model.user()).removeSensitiveData() : undefined,
			favoritable,
			model.createdAt()?.toISOString(),
		);
	}
}

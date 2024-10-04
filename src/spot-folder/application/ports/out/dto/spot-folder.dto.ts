import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { SpotFolderItem } from 'src/spot-folder/domain/spot-folder-item.model';
import { SpotFolderVisibility } from 'src/spot-folder/domain/spot-folder-visibility.enum';
import { SpotFolder } from 'src/spot-folder/domain/spot-folder.model';
import { SpotDto } from 'src/spot/application/ports/out/dto/spot.dto';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

class SpotFolderItemDto extends Dto {
	@ApiProperty()
	public spot: SpotDto = undefined;
	@ApiProperty()
	public order_number: number = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public added_at: string = undefined;

	private constructor(
		spot?: SpotDto,
		order_number?: number,
		added_at?: string,
	) {
		super();
		this.spot = spot;
		this.order_number = order_number;
		this.added_at = added_at;
	}

	public static fromModel(model: SpotFolderItem): SpotFolderItemDto {
		if (model === null || model === undefined) return null;

		return new SpotFolderItemDto(
			SpotDto.fromModel(model.spot()),
			model.orderNumber(),
			model.addedAt()?.toISOString(),
		);
	}
}

export class SpotFolderDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public name: string = undefined;
	@ApiProperty()
	public description: string = undefined;
	@ApiProperty()
	public hex_color: string = undefined;
	@ApiProperty({ enum: SpotFolderVisibility })
	public visibility: string = undefined;
	@ApiProperty({ type: [SpotFolderItemDto], isArray: true })
	public items: SpotFolderItemDto[] = undefined;
	@ApiProperty()
	public favorited: boolean = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public favorited_at: string = undefined;
	@ApiProperty()
	public total_favorites: number = undefined;
	@ApiProperty()
	public total_spots: number = undefined;
	@ApiProperty()
	public creator: UserDto = undefined;

	private constructor(
		id?: string,
		name?: string,
		description?: string,
		hex_color?: string,
		visibility?: string,
		items?: SpotFolderItemDto[],
		creator?: UserDto,
	) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.hex_color = hex_color;
		this.visibility = visibility;
		this.items = items;
		this.total_spots = items.length;
		this.creator = creator;
	}

	public static fromModel(model: SpotFolder): SpotFolderDto {
		if (model === null || model === undefined) return null;

		return new SpotFolderDto(
			model.id(),
			model.name(),
			model.description(),
			model.hexColor(),
			model.visibility(),
			model.items().map((item) => SpotFolderItemDto.fromModel(item)),
			model.creator() ? UserDto.fromModel(model.creator()).removeSensitiveData() : undefined
		);
	}

	public setFavoritedAt(favorited_at: Date): SpotFolderDto {
		this.favorited_at = favorited_at?.toISOString() ?? null;
		this.favorited = favorited_at !== null && favorited_at !== undefined;

		return this;
	}

	public setTotalFavorites(totalFavorites: number): SpotFolderDto {
		this.total_favorites = totalFavorites;

		return this;
	}
}

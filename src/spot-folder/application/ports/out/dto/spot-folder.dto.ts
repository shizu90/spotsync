import { Dto } from 'src/common/core/common.dto';
import { SpotFolderItem } from 'src/spot-folder/domain/spot-folder-item.model';
import { SpotFolder } from 'src/spot-folder/domain/spot-folder.model';
import { SpotDto } from 'src/spot/application/ports/out/dto/spot.dto';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

class SpotFolderItemDto extends Dto {
	public spot: SpotDto = undefined;
	public order_number: number = undefined;
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
	public id: string = undefined;
	public name: string = undefined;
	public description: string = undefined;
	public hex_color: string = undefined;
	public visibility: string = undefined;
	public items: SpotFolderItemDto[] = undefined;
	public favorited: boolean = undefined;
	public favorited_at: string = undefined;
	public total_favorites: number = undefined;
	public total_spots: number = undefined;
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

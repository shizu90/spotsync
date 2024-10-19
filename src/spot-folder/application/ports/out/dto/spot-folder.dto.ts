import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { SpotFolderItem } from 'src/spot-folder/domain/spot-folder-item.model';
import { SpotFolderVisibility } from 'src/spot-folder/domain/spot-folder-visibility.enum';
import { SpotFolder } from 'src/spot-folder/domain/spot-folder.model';
import { SpotDto } from 'src/spot/application/ports/out/dto/spot.dto';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

class SpotFolderItemDto extends Dto {
	@ApiPropertyOptional()
	public spot: SpotDto = undefined;
	@ApiPropertyOptional()
	public order_number: number = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
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
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public name: string = undefined;
	@ApiPropertyOptional()
	public description: string = undefined;
	@ApiPropertyOptional()
	public hex_color: string = undefined;
	@ApiPropertyOptional({ enum: SpotFolderVisibility })
	public visibility: string = undefined;
	@ApiPropertyOptional({ type: SpotFolderItemDto, isArray: true })
	public items: SpotFolderItemDto[] = undefined;
	@ApiPropertyOptional()
	public favorited: boolean = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public favorited_at: string = undefined;
	@ApiPropertyOptional()
	public total_favorites: number = undefined;
	@ApiPropertyOptional()
	public total_spots: number = undefined;
	@ApiPropertyOptional()
	public average_rating: number = undefined;
	@ApiPropertyOptional()
	public creator: UserDto = undefined;

	private constructor(
		id?: string,
		name?: string,
		description?: string,
		hex_color?: string,
		visibility?: string,
		items?: SpotFolderItemDto[],
		creator?: UserDto,
		favorited?: boolean,
		favorited_at?: string,
		total_favorites?: number,
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
		this.favorited = favorited;
		this.favorited_at = favorited_at;
		this.total_favorites = total_favorites;
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
			model.creator() ? UserDto.fromModel(model.creator()).removeSensitiveData() : undefined,
			false,
			null,
			0,
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

	public setAverageRating(averageRating: number): SpotFolderDto {
		this.average_rating = averageRating;

		return this;
	}
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { SpotAddress } from 'src/spot/domain/spot-address.model';
import { SpotPhoto } from 'src/spot/domain/spot-photo.model';
import { SpotType } from 'src/spot/domain/spot-type.enum';
import { Spot } from 'src/spot/domain/spot.model';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';

class SpotAddressDto extends Dto {
	@ApiPropertyOptional()
	public area: string = undefined;
	@ApiPropertyOptional()
	public sub_area: string = undefined;
	@ApiPropertyOptional()
	public locality: string = undefined;
	@ApiPropertyOptional()
	public latitude: number = undefined;
	@ApiPropertyOptional()
	public longitude: number = undefined;
	@ApiPropertyOptional()
	public country_code: string = undefined;

	private constructor(
		area?: string,
		sub_area?: string,
		locality?: string,
		latitude?: number,
		longitude?: number,
		country_code?: string,
	) {
		super();
		this.area = area;
		this.sub_area = sub_area;
		this.locality = locality;
		this.latitude = latitude;
		this.longitude = longitude;
		this.country_code = country_code;
	}

	public static fromModel(model: SpotAddress): SpotAddressDto {
		if (model === null || model === undefined) return null;

		return new SpotAddressDto(
			model.area(),
			model.subArea(),
			model.locality(),
			model.latitude(),
			model.longitude(),
			model.countryCode(),
		);
	}
}

class SpotPhotoDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public file_path: string = undefined;

	private constructor(id?: string, file_path?: string) {
		super();
		this.id = id;
		this.file_path = file_path;
	}

	public static fromModel(model: SpotPhoto): SpotPhotoDto {
		if (model === null || model === undefined) return null;

		return new SpotPhotoDto(model.id(), model.filePath());
	}
}

export class SpotDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public name: string = undefined;
	@ApiPropertyOptional()
	public description: string = undefined;
	@ApiPropertyOptional({ enum: SpotType })
	public type: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public created_at: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public updated_at: string = undefined;
	@ApiPropertyOptional()
	public address: SpotAddressDto = undefined;
	@ApiPropertyOptional({ type: SpotPhotoDto, isArray: true })
	public photos: SpotPhotoDto[] = undefined;
	@ApiPropertyOptional()
	public creator: UserDto = undefined;
	@ApiPropertyOptional()
	public distance: number = undefined;
	@ApiPropertyOptional()
	public visited: boolean = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public visited_at: string = undefined;
	@ApiPropertyOptional()
	public favorited: boolean = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
	public favorited_at: string = undefined;
	@ApiPropertyOptional()
	public average_rating: number = undefined;
	@ApiPropertyOptional()
	public total_ratings: number = undefined;
	@ApiPropertyOptional()
	public total_spot_visits: number = undefined;
	@ApiPropertyOptional()
	public total_favorites: number = undefined;
	@ApiPropertyOptional()
	public total_events: number = undefined;

	private constructor(
		id?: string,
		name?: string,
		description?: string,
		type?: string,
		created_at?: string,
		updated_at?: string,
		address?: SpotAddressDto,
		photos?: SpotPhotoDto[],
		creator?: UserDto,
		distance?: number,
		visited?: boolean,
		visited_at?: string,
		favorited?: boolean,
		favorited_at?: string,
		average_rating?: number,
		total_ratings?: number,
		total_spot_visits?: number,
		total_favorites?: number,
		total_events?: number,
	) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.type = type;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.address = address;
		this.photos = photos;
		this.creator = creator;
		this.distance = distance;
		this.visited = visited;
		this.visited_at = visited_at;
		this.favorited = favorited;
		this.favorited_at = favorited_at;
		this.average_rating = average_rating;
		this.total_ratings = total_ratings;
		this.total_spot_visits = total_spot_visits;
		this.total_favorites = total_favorites;
		this.total_events = total_events;
	}

	public static fromModel(model: Spot): SpotDto {
		if (model === null || model === undefined) return null;

		return new SpotDto(
			model.id(),
			model.name(),
			model.description(),
			model.type(),
			model.createdAt().toISOString(),
			model.updatedAt().toISOString(),
			model.address() ? SpotAddressDto.fromModel(model.address()) : undefined,
			model.photos().map((photo) => SpotPhotoDto.fromModel(photo)),
			model.creator() ? UserDto.fromModel(model.creator()).removeSensitiveData() : undefined,
			0,
			false,
			null,
			false,
			null,
			0,
			0,
			0,
			0,
			0,
		);
	}

	public setDistance(distance: number): SpotDto {
		this.distance = distance;

		return this;
	}

	public setVisitedAt(visited_at: Date): SpotDto {
		this.visited_at = visited_at?.toISOString() ?? null;
		this.visited = visited_at !== null && visited_at !== undefined;

		return this;
	}

	public setFavoritedAt(favorited_at: Date): SpotDto {
		this.favorited_at = favorited_at?.toISOString() ?? null;
		this.favorited = favorited_at !== null && favorited_at !== undefined;

		return this;
	}

	public setAverageRating(average_rating: number): SpotDto {
		this.average_rating = average_rating;

		return this;
	}

	public setTotalRatings(total_ratings: number): SpotDto {
		this.total_ratings = total_ratings;

		return this;
	}

	public setTotalSpotVisits(total_spot_visits: number): SpotDto {
		this.total_spot_visits = total_spot_visits;

		return this;
	}

	public setTotalFavorites(total_favorites: number): SpotDto {
		this.total_favorites = total_favorites;

		return this;
	}

	public setTotalEvents(total_events: number): SpotDto {
		this.total_events = total_events;

		return this;
	}
}

import { CreateSpotCommand } from 'src/spot/application/ports/in/commands/create-spot.command';
import { DeleteSpotCommand } from 'src/spot/application/ports/in/commands/delete-spot.command';
import { FavoriteSpotCommand } from 'src/spot/application/ports/in/commands/favorite-spot.command';
import { GetSpotCommand } from 'src/spot/application/ports/in/commands/get-spot.command';
import { ListSpotsCommand } from 'src/spot/application/ports/in/commands/list-spots.command';
import { UnfavoriteSpotCommand } from 'src/spot/application/ports/in/commands/unfavorite-spot.command';
import { UnvisitSpotCommand } from 'src/spot/application/ports/in/commands/unvisit-spot.command';
import { UpdateSpotCommand } from 'src/spot/application/ports/in/commands/update-spot.command';
import { VisitSpotCommand } from 'src/spot/application/ports/in/commands/visit-spot.command';
import { CreateSpotRequest } from '../requests/create-spot.request';
import { ListSpotsQueryRequest } from '../requests/list-spot-query.request';
import { UpdateSpotRequest } from '../requests/update-spot.request';

export class SpotRequestMapper {
	public static listSpotsCommand(
		query: ListSpotsQueryRequest,
	): ListSpotsCommand {
		return new ListSpotsCommand(
			query.name,
			query.type,
			query.creator_id,
			query.favorited_by_id,
			query.visited_by_id,
			query.sort,
			query.sort_direction,
			query.page,
		);
	}

	public static getSpotCommand(id: string): GetSpotCommand {
		return new GetSpotCommand(id);
	}

	public static createSpotCommand(
		body: CreateSpotRequest,
	): CreateSpotCommand {
		return new CreateSpotCommand(
			body.name,
			body.type,
			{
				area: body.address.area,
				subArea: body.address.sub_area,
				countryCode: body.address.country_code,
				locality: body.address.locality,
				latitude: body.address.latitude,
				longitude: body.address.longitude,
			},
			body.description,
		);
	}

	public static updateSpotCommand(
		id: string,
		body: UpdateSpotRequest,
	): UpdateSpotCommand {
		return new UpdateSpotCommand(
			id,
			body.name,
			body.description,
			body.type,
			{
				area: body.address.area,
				subArea: body.address.sub_area,
				countryCode: body.address.country_code,
				locality: body.address.locality,
				latitude: body.address.latitude,
				longitude: body.address.longitude,
			},
		);
	}

	public static deleteSpotCommand(id: string): DeleteSpotCommand {
		return new DeleteSpotCommand(id);
	}

	public static favoriteSpotCommand(id: string): FavoriteSpotCommand {
		return new FavoriteSpotCommand(id);
	}

	public static unfavoriteSpotCommand(id: string): UnfavoriteSpotCommand {
		return new UnfavoriteSpotCommand(id);
	}

	public static visitSpotCommand(id: string): VisitSpotCommand {
		return new VisitSpotCommand(id);
	}

	public static unvisitSpotCommand(id: string): UnvisitSpotCommand {
		return new UnvisitSpotCommand(id);
	}
}

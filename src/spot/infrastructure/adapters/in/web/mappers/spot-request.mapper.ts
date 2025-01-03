import { CreateSpotCommand } from 'src/spot/application/ports/in/commands/create-spot.command';
import { DeleteSpotCommand } from 'src/spot/application/ports/in/commands/delete-spot.command';
import { GetSpotAttachmentCommand } from 'src/spot/application/ports/in/commands/get-spot-attachment.command';
import { GetSpotCommand } from 'src/spot/application/ports/in/commands/get-spot.command';
import { ListSpotsCommand } from 'src/spot/application/ports/in/commands/list-spots.command';
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
			query.min_rating,
			query.max_rating,
			query.min_distance,
			query.max_distance,
			query.country,
			query.state,
			query.city,
			query.creator_id,
			query.favorited_by_id,
			query.visited_by_id,
			query.sort,
			query.sort_direction,
			query.page,
			query.limit,
			query.paginate,
		);
	}

	public static getSpotCommand(id: string): GetSpotCommand {
		return new GetSpotCommand(id);
	}

	public static createSpotCommand(
		body: CreateSpotRequest,
		files: Express.Multer.File[],
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
			files,
		);
	}

	public static updateSpotCommand(
		id: string,
		body: UpdateSpotRequest,
		files: Express.Multer.File[],
	): UpdateSpotCommand {
		return new UpdateSpotCommand(
			id,
			body.name,
			body.description,
			body.type,
			body.address
				? {
						area: body.address.area,
						subArea: body.address.sub_area,
						countryCode: body.address.country_code,
						locality: body.address.locality,
						latitude: body.address.latitude,
						longitude: body.address.longitude,
					}
				: null,
			files,
		);
	}

	public static deleteSpotCommand(id: string): DeleteSpotCommand {
		return new DeleteSpotCommand(id);
	}

	public static visitSpotCommand(id: string): VisitSpotCommand {
		return new VisitSpotCommand(id);
	}

	public static unvisitSpotCommand(id: string): UnvisitSpotCommand {
		return new UnvisitSpotCommand(id);
	}

	public static getSpotAttachmentCommand(id: string, attachmentId: string): GetSpotAttachmentCommand {
		return new GetSpotAttachmentCommand(id, attachmentId);
	}
}

import { CancelSpotEventCommand } from "src/spot-event/application/ports/in/commands/cancel-spot-event.command";
import { CreateSpotEventCommand } from "src/spot-event/application/ports/in/commands/create-spot-event.command";
import { DeleteSpotEventCommand } from "src/spot-event/application/ports/in/commands/delete-spot-event.command";
import { EndSpotEventCommand } from "src/spot-event/application/ports/in/commands/end-spot-event.command";
import { GetSpotEventCommand } from "src/spot-event/application/ports/in/commands/get-spot-event.command";
import { ListSpotEventsCommand } from "src/spot-event/application/ports/in/commands/list-spot-events.command";
import { ParticipateCommand } from "src/spot-event/application/ports/in/commands/participate.command";
import { RemoveParticipationCommand } from "src/spot-event/application/ports/in/commands/remove-participation.command";
import { StartSpotEventCommand } from "src/spot-event/application/ports/in/commands/start-spot-event.command";
import { UpdateSpotEventCommand } from "src/spot-event/application/ports/in/commands/update-spot-event.command";
import { CreateSpotEventRequest } from "../requests/create-spot-event.request";
import { ListSpotEventsQueryRequest } from "../requests/list-spot-events-query.request";
import { UpdateSpotEventRequest } from "../requests/update-spot-event.request";

export class SpotEventRequestMapper {
    public static listSpotEventsCommand(query: ListSpotEventsQueryRequest): ListSpotEventsCommand {
        return new ListSpotEventsCommand(
            query.spot_id,
            query.group_id,
            query.start_date,
            query.end_date,
            query.status,
            query.sort,
            query.sort_direction,
            query.page,
            query.limit,
            query.paginate,
        );
    }

    public static createSpotEventCommand(body: CreateSpotEventRequest): CreateSpotEventCommand {
        return new CreateSpotEventCommand(
            body.spot_id,
            body.name,
            body.description,
            body.start_date,
            body.end_date,
            body.group_id,
        );
    }

    public static updateSpotEventCommand(id: string, body: UpdateSpotEventRequest): UpdateSpotEventCommand {
        return new UpdateSpotEventCommand(
            id,
            body.name,
            body.description,
            body.start_date,
            body.end_date,
            body.notify_minutes,
        );
    }

    public static startSpotEventCommand(id: string): StartSpotEventCommand {
        return new StartSpotEventCommand(id);
    }

    public static endSpotEventCommand(id: string): EndSpotEventCommand {
        return new EndSpotEventCommand(id);
    }

    public static participateCommand(id: string): ParticipateCommand {
        return new ParticipateCommand(id);
    }

    public static removeParticipationCommand(id: string, userId: string): RemoveParticipationCommand {
        return new RemoveParticipationCommand(id, userId);
    }

    public static getSpotEventCommand(id: string): GetSpotEventCommand {
        return new GetSpotEventCommand(id);
    }

    public static deleteSpotEventCommand(id: string): DeleteSpotEventCommand {
        return new DeleteSpotEventCommand(id);
    }

    public static cancelSpotEventCommand(id: string): CancelSpotEventCommand {
        return new CancelSpotEventCommand(id);
    }
}
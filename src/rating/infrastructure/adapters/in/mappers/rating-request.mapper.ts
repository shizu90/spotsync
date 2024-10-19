import { CreateRatingCommand } from "src/rating/application/ports/in/commands/create-rating.command";
import { DeleteRatingCommand } from "src/rating/application/ports/in/commands/delete-rating.command";
import { GetRatingCommand } from "src/rating/application/ports/in/commands/get-rating.command";
import { ListRatingsCommand } from "src/rating/application/ports/in/commands/list-ratings.command";
import { UpdateRatingCommand } from "src/rating/application/ports/in/commands/update-rating.command";
import { CreateRatingRequest } from "../requests/create-rating.request";
import { ListRatingsQueryRequest } from "../requests/list-ratings-query.request";
import { UpdateRatingRequest } from "../requests/update-rating.request";

export class RatingRequestMapper {
    public static listRatingsCommand(query: ListRatingsQueryRequest): ListRatingsCommand {
        return new ListRatingsCommand(
            query.subject,
            query.subject_id,
            query.value,
            query.user_id,
            query.sort,
            query.sort_direction,
            query.page,
            query.limit,
            query.paginate,
        );
    }
    
    public static getRatingCommand(id: string): GetRatingCommand {
        return new GetRatingCommand(id);
    }

    public static createRatingCommand(body: CreateRatingRequest): CreateRatingCommand {
        return new CreateRatingCommand(
            body.value,
            body.subject,
            body.subject_id,
            body.comment,
        );
    }

    public static updateRatingCommand(id: string, body: UpdateRatingRequest): UpdateRatingCommand {
        return new UpdateRatingCommand(
            id,
            body.value,
            body.comment,
        );
    }

    public static DeleteRatingCommand(id: string): DeleteRatingCommand {
        return new DeleteRatingCommand(id);
    }
}
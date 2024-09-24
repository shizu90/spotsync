import { AddSpotCommand } from "src/spot-folder/application/ports/in/commands/add-spot.command";
import { CreateSpotFolderCommand } from "src/spot-folder/application/ports/in/commands/create-spot-folder.command";
import { DeleteSpotFolderCommand } from "src/spot-folder/application/ports/in/commands/delete-spot-folder.command";
import { FavoriteSpotFolderCommand } from "src/spot-folder/application/ports/in/commands/favorite-spot-folder.command";
import { GetSpotFolderCommand } from "src/spot-folder/application/ports/in/commands/get-spot-folder.command";
import { ListSpotFoldersCommand } from "src/spot-folder/application/ports/in/commands/list-spot-folders.command";
import { RemoveSpotCommand } from "src/spot-folder/application/ports/in/commands/remove-spot.command";
import { SortItemsCommand } from "src/spot-folder/application/ports/in/commands/sort-items.command";
import { UnfavoriteSpotFolderCommand } from "src/spot-folder/application/ports/in/commands/unfavorite-spot-folder.command";
import { UpdateSpotFolderCommand } from "src/spot-folder/application/ports/in/commands/update-spot-folder.command";
import { AddSpotRequest } from "../requests/add-spot.request";
import { CreateSpotFolderRequest } from "../requests/create-spot-folder.request";
import { ListSpotFoldersQueryRequest } from "../requests/list-spot-folders-query.request";
import { RemoveSpotRequest } from "../requests/remove-spot.request";
import { SortItemsRequest } from "../requests/sort-items.request";
import { UpdateSpotFolderRequest } from "../requests/update-spot-folder.request";

export class SpotFolderRequestMapper {
    public static getSpotFolderCommand(id: string): GetSpotFolderCommand {
        return new GetSpotFolderCommand(id);
    }

    public static listSpotFolderCommand(query: ListSpotFoldersQueryRequest): ListSpotFoldersCommand {
        return new ListSpotFoldersCommand(
            query.name,
            query.creator_id,
            query.sort,
            query.sort_direction,
            query.page,
            query.paginate,
            query.limit,
        );
    }

    public static createSpotFolderCommand(body: CreateSpotFolderRequest): CreateSpotFolderCommand {
        return new CreateSpotFolderCommand(
            body.name,
            body.description,
            body.hex_color,
            body.visibility,
        );
    }

    public static updateSpotFolderCommand(id: string, body: UpdateSpotFolderRequest) {
        return new UpdateSpotFolderCommand(
            id,
            body.name,
            body.description,
            body.hex_color,
            body.visibility,
        );
    }

    public static deleteSpotFolderCommand(id: string): DeleteSpotFolderCommand {
        return new DeleteSpotFolderCommand(id);
    }

    public static addSpotCommand(id: string, body: AddSpotRequest): AddSpotCommand {
        return new AddSpotCommand(id, body.spots);
    }

    public static removeSpotCommand(id: string, body: RemoveSpotRequest): RemoveSpotCommand {
        return new RemoveSpotCommand(id, body.spots)
    }

    public static favoriteSpotFolderCommand(id: string): FavoriteSpotFolderCommand {
        return new FavoriteSpotFolderCommand(id);
    }

    public static unfavoriteSpotFolderCommand(id: string): UnfavoriteSpotFolderCommand {
        return new UnfavoriteSpotFolderCommand(id);
    }

    public static sortItemsCommand(id: string, body: SortItemsRequest): SortItemsCommand {
        return new SortItemsCommand(id, body.spots.map(item => {
            return {
                spotId: item.spot_id,
                orderNumber: item.order_number,
            };
        }));
    }
}
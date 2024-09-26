import { Command } from "src/common/core/common.command";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";

export class ListFavoritesCommand extends Command {
    constructor(
        readonly userId?: string,
        readonly subject?: FavoritableSubject,
        readonly subjectId?: string,
        readonly sort?: string,
        readonly sortDirection?: SortDirection,
        readonly page?: number,
        readonly limit?: number,
        readonly paginate?: boolean,
    ) {
        super();
    }
}
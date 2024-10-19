import { Command } from "src/common/core/common.command";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";

export class ListRatingsCommand extends Command {
    constructor(
        readonly subject?: RatableSubject,
        readonly subjectId?: string,
        readonly value?: number,
        readonly userId?: string,
        readonly sort?: string,
        readonly sortDirection?: SortDirection,
        readonly page?: number,
        readonly limit?: number,
        readonly paginate?: boolean,
    ) {super();}
}
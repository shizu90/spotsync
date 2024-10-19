import { Command } from "src/common/core/common.command";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";

export class CalculateAverageRatingCommand extends Command {
    constructor(
        readonly subject: RatableSubject,
        readonly subjectId: string,
    ) {super();}
}
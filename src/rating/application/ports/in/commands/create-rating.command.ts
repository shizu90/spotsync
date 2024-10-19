import { Command } from "src/common/core/common.command";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";

export class CreateRatingCommand extends Command {
    constructor(
        readonly value: number,
        readonly subject: RatableSubject,
        readonly subjectId: string,
        readonly comment?: string,
    ) {super();}
}
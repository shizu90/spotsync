import { Command } from "src/common/common.command";
import { LikableSubject } from "src/like/domain/likable-subject.enum";

export class UnlikeCommand extends Command 
{
    constructor(
        readonly subject: LikableSubject,
        readonly subjectId: string
    ) 
    {super();}
}
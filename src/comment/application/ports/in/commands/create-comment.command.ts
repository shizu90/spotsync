import { CommentSubject } from "src/comment/domain/comment-subject.model.";
import { Command } from "src/common/core/common.command";

export class CreateCommentCommand extends Command {
    public constructor(
        readonly subject: CommentSubject,
        readonly subjectId: string,
        readonly text: string,
    ) 
    {super();}
}
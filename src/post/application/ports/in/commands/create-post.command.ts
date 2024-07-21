import { Command } from "src/common/common.command";
import { PostVisibility } from "src/post/domain/post-visibility.enum";

export class CreatePostCommand extends Command 
{
    constructor(
        readonly title: string,
        readonly content: string,
        readonly visibility: PostVisibility,
        readonly userId: string,
        readonly parentId?: string,
        readonly groupId?: string,
    ) 
    {super();}
}
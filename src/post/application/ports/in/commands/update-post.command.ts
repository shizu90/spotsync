import { Command } from "src/common/common.command";
import { PostVisibility } from "src/post/domain/post-visibility.enum";

export class UpdatePostCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly title?: string,
        readonly content?: string,
        readonly visibility?: PostVisibility,
        
    ) 
    {super();}
}
import { Command } from "src/common/core/common.command";

export class GetAttachmentCommand extends Command {
    constructor(
        public readonly postId: string,
        public readonly attachmentId: string
    ) {
        super();
    }
}
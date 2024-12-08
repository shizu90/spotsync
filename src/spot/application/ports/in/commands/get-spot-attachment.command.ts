import { Command } from "src/common/core/common.command";

export class GetSpotAttachmentCommand extends Command {
    constructor(
        public readonly id: string,
        public readonly attachmentId: string,
    ) 
    {super();}
}
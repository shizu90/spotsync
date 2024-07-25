import { Dto } from "src/common/common.dto";

export class UploadPostAttachmentDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly path: string,
        readonly type: string,
        readonly post_id: string
    ) 
    {super();}
}
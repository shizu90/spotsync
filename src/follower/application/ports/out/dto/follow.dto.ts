import { Dto } from "src/common/common.dto";

export class FollowDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly from_user_id: string,
        readonly to_user_id: string
    ) 
    {super();}
}
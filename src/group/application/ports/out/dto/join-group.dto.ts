import { Dto } from "src/common/common.dto";

export class JoinGroupDto extends Dto 
{
    constructor(
        readonly group_member_request_id: string,
        readonly group_id: string,
        readonly user_id: string
    ) 
    {super();}
}
import { Dto } from "src/common/common.dto";

export class AcceptUserGroupRequestDto extends Dto 
{
    constructor(
        readonly group_id: string,
        readonly user_id: string,
        readonly joined_at: Date,
        readonly group_role: {
            name: string,
            hex_color: string,
            permissions: {
                name: string
            }[]
        }
    ) 
    {super();}
}
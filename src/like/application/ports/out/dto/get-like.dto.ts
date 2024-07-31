import { Dto } from "src/common/common.dto";

export class GetLikeDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly subject: string,
        readonly subject_id: string,
        readonly user: {
            id: string,
            first_name: string,
            last_name: string,
            profile_theme_color: string,
            profile_picture: string,
            banner_picture: string,
            credentials: {name: string}
        },
        readonly created_at: Date
    ) 
    {super();}
}
import { Dto } from "src/common/common.dto";

export class GetUserProfileDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly profile_visibility: string,
        readonly biograph: string,
        readonly created_at: Date,
        readonly updated_at: Date,
        readonly profile_picture: string,
        readonly banner_picture: string,
        readonly credentials: {
            name: string
        },
        readonly address: {
            id: string,
            name: string,
            area: string,
            sub_area: string,
            locality: string,
            latitude: number,
            longitude: number,
            country_code: string,
            created_at: Date,
            updated_at: Date
        } | null
    ) 
    {super();}
}
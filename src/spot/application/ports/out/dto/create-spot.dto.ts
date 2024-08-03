import { Dto } from "src/common/common.dto";

export class CreateSpotDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly type: string,
        readonly address: {
            readonly area: string,
            readonly sub_area: string,
            readonly locality: string,
            readonly latitude: number,
            readonly longitude: number,
            readonly country_code: string,
        },
        readonly photos: {
            id: string,
            file_path: string,
        }[],
        readonly user_id: string,
        readonly created_at: Date,
        readonly updated_at: Date,
    ) 
    {super();}
}
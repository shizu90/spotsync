import { Dto } from "src/common/common.dto";

export class CreateUserAddressDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly name: string,
        readonly area: string,
        readonly sub_area: string,
        readonly locality: string,
        readonly country_code: string,
        readonly latitude: number,
        readonly longitude: number,
        readonly main: boolean,
        readonly created_at: Date,
        readonly updated_at: Date
    ) 
    {super();}
}
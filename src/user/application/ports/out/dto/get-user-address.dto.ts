import { Dto } from "src/common/common.dto"

export class GetUserAddressDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly name: string,
        readonly area: string,
        readonly subArea: string,
        readonly locality: string,
        readonly countryCode: string,
        readonly latitude: number,
        readonly longitude: number,
        readonly main: boolean,
        readonly createdAt: Date,
        readonly updatedAt: Date
    ) 
    {super();}
}
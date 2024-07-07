import { Dto } from "src/common/common.dto";

export class CreateUserDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly biograph: string,
        readonly profilePicture: string,
        readonly bannerPicture: string,
        readonly birthDate: Date,
        readonly isDeleted: boolean,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly credentials: {name: string, email: string}
    ) 
    {super();}
}
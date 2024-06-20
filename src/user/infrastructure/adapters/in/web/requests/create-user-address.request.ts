import { IsBoolean, IsString, Max, Min } from "class-validator";

export class CreateUserAddressRequest 
{
    @IsString()
    @Max(255)
    @Min(3)
    public name: string;

    @IsString()
    public area: string;

    @IsString()
    public subArea: string;

    @IsString()
    public locality: string;

    @IsString()
    @Max(2)
    @Min(2)
    public countryCode: string;

    @IsBoolean()
    public main: boolean;
}
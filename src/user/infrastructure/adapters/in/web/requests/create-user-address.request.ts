import { IsBoolean, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserAddressRequest 
{
    @IsString({message: "Address name is invalid"})
    @MaxLength(255, {message: "Address name must have less than 256 characters"})
    @MinLength(3, {message: "Address name must have at least 3 characters"})
    public name: string;

    @IsString({message: "Address area is invalid"})
    public area: string;

    @IsString({message: "Address sub area is invalid"})
    public sub_area: string;

    @IsString({message: "Address locality is invalid"})
    public locality: string;

    @IsString({message: "Address country code is invalid"})
    @MaxLength(2, {message: "Address country code must have less than 3 characters"})
    @MinLength(2, {message: "Address country code must have at least 2 characters"})
    public country_code: string;

    @IsBoolean({message: "Address main flag is invalid"})
    public main: boolean;
}
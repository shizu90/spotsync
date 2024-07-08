import { IsDateString, IsOptional, IsString, IsUrl, Matches, MaxLength, ValidateIf } from "class-validator";

export class UpdateUserProfileRequest 
{
    @IsUrl({}, {message: "Profile picture must be a URL address"})
    @IsOptional()
    public profile_picture?: string;

    @IsUrl({}, {message: "Banner picture must be a URL address"})
    @IsOptional()
    public banner_picture?: string;

    @IsString({message: "Biograph is invalid"})
    @MaxLength(800, {message: "Biograph must have less than 800"})
    @IsOptional()
    public biograph?: string;

    @IsDateString({}, {message: "Birth date is invalid"})
    @IsOptional()
    public birth_date?: Date;
}
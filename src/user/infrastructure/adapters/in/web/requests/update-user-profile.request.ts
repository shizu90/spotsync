import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateUserProfileRequest 
{
    @ApiProperty({required: false})
    @IsUrl({}, {message: "Profile picture must be a URL address"})
    @IsOptional()
    public profile_picture?: string;

    @ApiProperty({required: false})
    @IsUrl({}, {message: "Banner picture must be a URL address"})
    @IsOptional()
    public banner_picture?: string;

    @ApiProperty({required: false})
    @IsString({message: "Biograph is invalid"})
    @MaxLength(800, {message: "Biograph must have less than 800"})
    @IsOptional()
    public biograph?: string;

    @ApiProperty({required: false})
    @IsDateString({}, {message: "Birth date is invalid"})
    @IsOptional()
    public birth_date?: Date;
}
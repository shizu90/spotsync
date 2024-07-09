import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength, ValidateIf } from "class-validator";
import { ProfileVisibility } from "src/user/domain/profile-visibility.enum";

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

    @ApiProperty({required: false})
    @IsEnum(ProfileVisibility)
    public profile_visibility?: ProfileVisibility;
}
import { IsDateString, IsString, IsUrl, Matches, MaxLength } from "class-validator";

export class UpdateUserProfileRequest 
{
    @IsUrl()
    public profilePicture: string;

    @IsUrl()
    public bannerPicture: string;

    @IsString()
    @MaxLength(800)
    public biograph: string;

    @IsDateString()
    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
        message: '$property must be formatted as yyyy-mm-dd'
    })
    public birthDate: Date;
}
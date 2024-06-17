import { IsDateString, IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserRequest 
{
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    public name: string;
    
    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    public password: string;

    @IsDateString()
    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
        message: '$property must be formatted as yyyy-mm-dd'
    })
    public birthDate: Date;
}
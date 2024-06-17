import { IsEmail, IsString, Max, MAX, Min } from "class-validator";

export class UpdateUserCredentialsRequest 
{
    @IsString()
    @Min(3)
    @Max(255)
    public name: string;
    
    @IsEmail()
    public email: string;

    @IsString()
    @Min(6)
    @Max(32)
    public password: string;
}
import { IsEmail, IsOptional, IsString } from "class-validator";

export class SignInRequest 
{
    @IsEmail({}, {message: "Email is invalid"})
    @IsOptional()
    public email: string;

    @IsString({message: "Name is invalid"})
    @IsOptional()
    public name: string;

    @IsString({message: "Password is invalid"})
    public password: string;
}
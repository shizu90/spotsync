import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class SignInRequest 
{
    @ApiProperty({required: false})
    @IsEmail({}, {message: "Email is invalid"})
    @IsOptional()
    public email: string;

    @ApiProperty({required: false})
    @IsString({message: "Name is invalid"})
    @IsOptional()
    public name: string;

    @ApiProperty()
    @IsString({message: "Password is invalid"})
    public password: string;
}
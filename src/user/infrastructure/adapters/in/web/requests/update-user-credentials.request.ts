import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Max, MAX, MaxLength, Min, MinLength } from "class-validator";

export class UpdateUserCredentialsRequest 
{
    @ApiProperty({required: false})
    @IsString({message: "User name is invalid."})
    @MinLength(3, {message: "User name must have at least 3 characters."})
    @MaxLength(255, {message: "User name must have less than 255 characters."})
    @IsOptional()
    public name?: string;
    
    @ApiProperty({required: false})
    @IsEmail({}, {message: "E-mail is invalid."})
    @IsOptional()
    public email?: string;

    @ApiProperty({required: false})
    @IsString({message: "Password is invalid."})
    @MinLength(6, {message: "Password must have at least 6 characters."})
    @MaxLength(32, {message: "Password must have less than 32 characters."})
    @IsOptional()
    public password?: string;
}
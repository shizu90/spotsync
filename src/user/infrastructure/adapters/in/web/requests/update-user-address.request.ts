import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdateUserAddressRequest 
{
    @ApiProperty({required: false})
    @IsString({message: "Address name is invalid"})
    @MaxLength(255, {message: "Address name must have less than 256 characters."})
    @MinLength(3, {message: "Address name must have at least 3 characters"})
    @IsOptional()
    public name?: string;

    @ApiProperty({required: false})
    @IsString({message: "Address area is invalid"})
    @IsOptional()
    public area?: string;

    @ApiProperty({required: false})
    @IsString({message: "Address sub area is invalid"})
    @IsOptional()
    public sub_area?: string;

    @ApiProperty({required: false})
    @IsString({message: "Address locality is invalid"})
    @IsOptional()
    public locality?: string;

    @ApiProperty({required: false})
    @IsString({message: "Address country code is invalid"})
    @MaxLength(2, {message: "Address country code must have less than 3 characters"})
    @MinLength(2, {message: "Address country code must have at least 2 characters"})
    @IsOptional()
    public country_code?: string;

    @ApiProperty({required: false})
    @IsBoolean({message: "Address main flag is invalid"})
    @IsOptional()
    public main?: boolean;
}
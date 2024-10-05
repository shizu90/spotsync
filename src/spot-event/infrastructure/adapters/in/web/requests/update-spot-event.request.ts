import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class UpdateSpotEventRequest extends ApiRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    @MinLength(3)
    public name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(400)
    public description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    public start_date?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    public end_date?: Date;
}
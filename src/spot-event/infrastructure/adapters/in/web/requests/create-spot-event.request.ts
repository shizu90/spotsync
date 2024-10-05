import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class CreateSpotEventRequest extends ApiRequest {
    @ApiProperty()
    @IsUUID(4)
    public spot_id: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    @MinLength(3)
    public name: string;

    @ApiProperty()
    @IsString()
    @MaxLength(400)
    public description: string;

    @ApiProperty()
    @IsDateString()
    public start_date: Date;

    @ApiProperty()
    @IsDateString()
    public end_date: Date;

    @ApiProperty()
    @IsOptional()
    @IsUUID(4)
    public group_id?: string;
}
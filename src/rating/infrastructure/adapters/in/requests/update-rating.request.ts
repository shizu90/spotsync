import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class UpdateRatingRequest extends ApiRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    public value?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(400)
    public comment?: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class UpdateCommentRequest extends ApiRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(400)
    public text?: string;
}
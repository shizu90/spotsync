import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsUUID } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class AddSpotRequest extends ApiRequest {
    @ApiProperty({ required: true })
    @IsArray()
    @IsUUID("4", { each: true })
    @ArrayMinSize(1)
    public spots: string[];
}
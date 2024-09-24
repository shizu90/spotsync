import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID, ValidateNested } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class RemoveSpotRequest extends ApiRequest {
    @ApiProperty({ required: true })
    @IsArray()
    @ValidateNested()
    @IsUUID(4, { each: true })
    public spots: string[];
}
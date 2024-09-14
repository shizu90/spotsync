import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class ActivateUserRequest extends ApiRequest {
    @ApiProperty({
        required: true,
    })
    @IsString()
    public code: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    public auto_login?: boolean;
}
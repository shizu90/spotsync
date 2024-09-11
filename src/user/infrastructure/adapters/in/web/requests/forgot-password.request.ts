import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";

export class ForgotPasswordRequest extends ApiRequest {
    @ApiProperty({
        required: true
    })
    @IsEmail()
    public email: string;
}
import { Dto } from "src/common/core/common.dto";

export class ForgotPasswordDto extends Dto {
    constructor(
        readonly id: string,
        readonly token: string,
        readonly status: string,
        readonly created_at: Date,
        readonly expires_at: Date,
    ) {super();}
}
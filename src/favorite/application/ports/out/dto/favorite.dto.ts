import { Dto } from "src/common/core/common.dto";

export class FavoriteDto extends Dto {
    constructor(
        readonly id: string,
        readonly subject: string,
        readonly subject_id: string,
        readonly user_id: string,
        readonly created_at: string,
    ) {
        super();
    }
}
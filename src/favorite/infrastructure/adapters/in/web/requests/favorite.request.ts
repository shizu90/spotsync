import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";

export class FavoriteRequest extends ApiRequest {
    @ApiProperty({ required: true, enum: FavoritableSubject })
    @IsEnum(FavoritableSubject)
    public subject: FavoritableSubject;

    @ApiProperty({ required: true })
    @IsUUID(4)
    public subject_id: string;
}
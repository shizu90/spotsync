import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { ApiRequest } from "src/common/web/common.request";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";

export class CreateRatingRequest extends ApiRequest {
    @ApiProperty()
    @IsNumber()
    public value: number;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(400)
    public comment: string;

    @ApiProperty()
    @IsUUID(4)
    public subject_id: string;

    @ApiProperty({ enum: RatableSubject })
    @IsEnum(RatableSubject)
    public subject: RatableSubject;
}
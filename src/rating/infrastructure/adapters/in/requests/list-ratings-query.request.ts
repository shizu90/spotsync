import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { ApiRequest } from "src/common/web/common.request";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";

@ApiQuery({})
export class ListRatingsQueryRequest extends ApiRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    public value?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID(4)
    public user_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID(4)
    public subject_id?: string;

    @ApiProperty({ required: false, enum: RatableSubject })
    @IsOptional()
    @IsEnum(RatableSubject)
    public subject?: RatableSubject;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    public sort?: string;

    @ApiProperty({ required: false, enum: SortDirection })
    @IsOptional()
    @IsEnum(SortDirection)
    public sort_direction?: SortDirection;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    public page?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    public limit?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    public paginate?: boolean;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsEnum, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PostVisibility } from "src/post/domain/post-visibility.enum";

export class ListThreadsQueryRequest 
{
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(PostVisibility)
    public visibility?: PostVisibility;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID(4)
    public group_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID(4)
    public user_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    public sort?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(SortDirection)
    public sort_direction?: SortDirection;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    public page?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBooleanString()
    public paginate?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    public limit?: number;
}
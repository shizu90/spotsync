import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { ApiRequest } from "src/common/web/common.request";
import { SpotEventStatus } from "src/spot-event/domain/spot-event-status.enum";

@ApiQuery({})
export class ListSpotEventsQueryRequest extends ApiRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID(4)
    public spot_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID(4)
    public group_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    public start_date?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    public end_date?: Date;

    @ApiProperty({ required: false, enum: SpotEventStatus })
    @IsOptional()
    @IsEnum(SpotEventStatus)
    public status?: SpotEventStatus;

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
import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsString, IsUUID } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { ApiRequest } from "src/common/web/common.request";
import { SpotEventStatus } from "src/spot-event/domain/spot-event-status.enum";

@ApiQuery({})
export class ListSpotEventsQueryRequest extends ApiRequest {
    @ApiProperty({ required: false })
    @IsUUID(4)
    public spot_id?: string;

    @ApiProperty({ required: false })
    @IsUUID(4)
    public group_id?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    public start_date?: Date;

    @ApiProperty({ required: false })
    @IsDateString()
    public end_date?: Date;

    @ApiProperty({ required: false, enum: SpotEventStatus })
    @IsEnum(SpotEventStatus)
    public status?: SpotEventStatus;

    @ApiProperty({ required: false })
    @IsString()
    public sort?: string;

    @ApiProperty({ required: false, enum: SortDirection })
    @IsEnum(SortDirection)
    public sort_direction?: SortDirection;

    @ApiProperty({ required: false })
    @IsNumber()
    public page?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    public limit?: number;

    @ApiProperty({ required: false })
    @IsBoolean()
    public paginate?: boolean;
}
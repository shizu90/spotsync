import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { ApiRequest } from "src/common/web/common.request";
import { NotificationStatus } from "src/notification/domain/notification-status.enum";
import { NotificationType } from "src/notification/domain/notification-type.enum";

@ApiQuery({})
export class ListNotificationsQueryRequest extends ApiRequest {
    @ApiProperty({ required: false, enum: NotificationStatus })
    @IsOptional()
    @IsEnum(NotificationStatus)
    public status?: NotificationStatus;

    @ApiProperty({ required: false, enum: NotificationType })
    @IsOptional()
    @IsEnum(NotificationType)
    public type?: NotificationType;

    @ApiProperty({ required: false })
    @IsOptional()
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
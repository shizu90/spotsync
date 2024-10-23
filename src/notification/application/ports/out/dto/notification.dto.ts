import { ApiPropertyOptional } from "@nestjs/swagger";
import { Dto } from "src/common/core/common.dto";
import { NotificationStatus } from "src/notification/domain/notification-status.enum";
import { NotificationType } from "src/notification/domain/notification-type.enum";
import { Notification } from "src/notification/domain/notification.model";

export class NotificationDto extends Dto {
    @ApiPropertyOptional({ example: 'uuid' })
    public id: string = undefined;
    @ApiPropertyOptional()
    public title: string = undefined;
    @ApiPropertyOptional()
    public content: string = undefined;
    @ApiPropertyOptional({ enum: NotificationType })
    public type: string = undefined;
    @ApiPropertyOptional({ enum: NotificationStatus })
    public status: string = undefined;
    @ApiPropertyOptional()
    public payload: Object = undefined;
    @ApiPropertyOptional({ example: new Date().toISOString() })
    public read_at: string = undefined;
    @ApiPropertyOptional({ example: new Date().toISOString() })
    public created_at: string = undefined;

    private constructor(
        id?: string,
        title?: string,
        content?: string,
        type?: string,
        payload?: Object,
        status?: string,
        readAt?: string,
        createdAt?: string
    ) {
        super();

        this.id = id;
        this.title = title;
        this.content = content;
        this.type = type;
        this.status = status;
        this.payload = payload;
        this.read_at = readAt;
        this.created_at = createdAt;
    }

    public static fromModel(model: Notification): NotificationDto {
        if (!model) return null;

        return new NotificationDto(
            model.id(),
            model.title(),
            model.content(),
            model.type(),
            model.payload(),
            model.status(),
            model.readAt()?.toISOString(),
            model.createdAt()?.toISOString(),
        );
    }
}
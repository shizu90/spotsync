import { Model } from "src/common/core/common.model";
import { User } from "src/user/domain/user.model";
import { NotificationStatus } from "./notification-status.enum";
import { NotificationType } from "./notification-type.enum";

export enum NotificationPayloadSubject {
    SPOT = 'spot',
    SPOT_EVENT = 'spot-event',
    SPOT_FOLDER = 'spot-folder',
    POST = 'post',
    RATING = 'rating',
    COMMENT = 'comment',
    FOLLOW = 'follow',
}

export class NotificationPayload {
    public subject?: NotificationPayloadSubject = undefined;
    public subject_id?: string = undefined;
    public extra_data?: any = undefined;

    public constructor(
        subject?: NotificationPayloadSubject,
        subject_id?: string,
        extra_data?: any
    ) {
        this.subject = subject;
        this.subject_id = subject_id;
        this.extra_data = extra_data;
    }
}

export class Notification extends Model {
    private _id: string;
    private _title: string;
    private _content: string;
    private _status: NotificationStatus;
    private _type: NotificationType;
    private _user: User;
    private _payload: NotificationPayload;
    private _readAt: Date;
    private _createdAt: Date;

    private constructor(
        id: string,
        title: string,
        content: string,
        user: User,
        type: NotificationType,
        payload?: NotificationPayload,
        status?: NotificationStatus,
        readAt?: Date,
        createdAt?: Date
    ) {
        super();

        this._id = id;
        this._title = title;
        this._content = content;
        this._status = status ?? NotificationStatus.UNREAD;
        this._type = type;
        this._user = user;
        this._payload = {};
        this._readAt = readAt;
        this._createdAt = createdAt;
    }

    public static create(
        id: string,
        title: string,
        content: string,
        user: User,
        type: NotificationType,
        payload?: NotificationPayload,
        status?: NotificationStatus,
        readAt?: Date,
        createdAt?: Date
    ): Notification {
        return new Notification(id, title, content, user, type, payload, status, readAt, createdAt);
    }

    public id(): string {
        return this._id;
    }

    public title(): string {
        return this._title;
    }

    public content(): string {
        return this._content;
    }

    public status(): NotificationStatus {
        return this._status;
    }

    public type(): NotificationType {
        return this._type;
    }

    public user(): User {
        return this._user;
    }
    
    public payload(): NotificationPayload {
        return this._payload;
    }

    public readAt(): Date {
        return this._readAt;
    }

    public createdAt(): Date {
        return this._createdAt;
    }

    public markAsRead(): void {
        if (this._status === NotificationStatus.UNREAD) {
            this._status = NotificationStatus.READ;
            this._readAt = new Date();
        }
    }
}
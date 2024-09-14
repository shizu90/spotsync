import { Model } from "src/common/core/common.model";
import { User } from "src/user/domain/user.model";
import { ActivationRequestStatus } from "./activation-request-status.enum";
import { ActivationRequestSubject } from "./activation-request-subject.enum";

export class ActivationRequest extends Model {
    private _id: string;
    private _user: User;
    private _code: string;
    private _status: ActivationRequestStatus;
    private _subject: ActivationRequestSubject;
    private _requestedAt: Date;

    private constructor(
        id: string,
        user: User,
        subject: ActivationRequestSubject,
        code?: string,
        status?: ActivationRequestStatus,
        requestedAt?: Date
    ) {
        super();
        this._id = id;
        this._user = user;
        this._code = code || this.generateCode();
        this._status = status || ActivationRequestStatus.PENDING;
        this._subject = subject;
        this._requestedAt = requestedAt || new Date();
    }

    public static create(
        id: string,
        user: User,
        subject: ActivationRequestSubject,
        code?: string,
        status?: ActivationRequestStatus,
        requestedAt?: Date
    ): ActivationRequest {
        return new ActivationRequest(id, user, subject, code, status, requestedAt);
    }

    public id(): string {
        return this._id;
    }

    public user(): User {
        return this._user;
    }

    public code(): string {
        return this._code;
    }

    public status(): ActivationRequestStatus {
        return this._status;
    }

    public subject(): ActivationRequestSubject {
        return this._subject;
    }

    public requestedAt(): Date {
        return this._requestedAt;
    }

    public approve(): void {
        this._status = ActivationRequestStatus.APPROVED;
    }

    public reject(): void {
        this._status = ActivationRequestStatus.REJECTED;
    }

    public isPending(): boolean {
        return this._status === ActivationRequestStatus.PENDING;
    }

    public isApproved(): boolean {
        return this._status === ActivationRequestStatus.APPROVED;
    }

    public isRejected(): boolean {
        return this._status === ActivationRequestStatus.REJECTED;
    }

    public generateCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }    
}
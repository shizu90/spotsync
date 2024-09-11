import { randomUUID } from "crypto";
import * as moment from "moment";
import { Model } from "src/common/core/common.model";
import { PasswordRecoveryStatus } from "./password-recovery-status.enum";
import { User } from "./user.model";

export class PasswordRecovery extends Model {
    private _id: string;
    private _status: PasswordRecoveryStatus;
    private _token: string;
    private _user: User;
    private _createdAt: Date;
    private _expiresAt: Date;

    private constructor(
        id: string,
        user: User,
        status?: PasswordRecoveryStatus,
        token?: string,
        createdAt?: Date,
        expiresAt?: Date
    ) {
        super();
        this._id = id ?? randomUUID();
        this._user = user;
        this._status = status ?? PasswordRecoveryStatus.NEW;
        this._token = this.generateToken();
        this._createdAt = createdAt ?? new Date();
        this._expiresAt = expiresAt ?? moment(this._createdAt).add(1, 'days').toDate();
    }

    public static create(
        id: string,
        user: User,
        status?: PasswordRecoveryStatus,
        token?: string,
        createdAt?: Date,
        expiresAt?: Date,
    ) {
        return new PasswordRecovery(id, user, status, token, createdAt, expiresAt);
    }

    private generateToken(): string {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    public id(): string {
        return this._id;
    }

    public user(): User {
        return this._user;
    }

    public status(): PasswordRecoveryStatus {
        return this._status;
    }

    public token(): string {
        return this._token;
    }

    public createdAt(): Date {
        return this._createdAt;
    }

    public expiresAt(): Date {
        return this._expiresAt;
    }

    public isExpired(): boolean {
        return moment(new Date()).isAfter(moment(this._expiresAt));
    }

    public use(): void {
        this._status = PasswordRecoveryStatus.USED;
    }

    public expire(): void {
        if(this.isExpired()) this._status = PasswordRecoveryStatus.EXPIRED;
    }
}
import { Model } from "src/common/core/common.model";
import { User } from "src/user/domain/user.model";
import { RatableSubject } from "./ratable-subject.enum";

export class Rating extends Model {
    private _id: string;
    private _value: number;
    private _comment: string;
    private _subject: RatableSubject;
    private _subjectId: string;
    private _user: User;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        value: number,
        subject: RatableSubject,
        subjectId: string,
        user: User,
        comment?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super();
        this._id = id;
        this._value = value;
        this._comment = comment;
        this._subject = subject;
        this._subjectId = subjectId;
        this._user = user;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt;
    }

    public static create(
        id: string,
        value: number,
        subject: RatableSubject,
        subjectId: string,
        user: User,
        comment?: string,
        createdAt?: Date,
        updatedAt?: Date
    ): Rating {
        return new Rating(id, value, subject, subjectId, user, comment, createdAt, updatedAt);
    }

    public id(): string {
        return this._id;
    }

    public value(): number {
        return this._value;
    }

    public comment(): string {
        return this._comment;
    }

    public subject(): RatableSubject {
        return this._subject;
    }

    public subjectId(): string {
        return this._subjectId;
    }

    public user(): User {
        return this._user;
    }

    public createdAt(): Date {
        return this._createdAt;
    }

    public updatedAt(): Date {
        return this._updatedAt;
    }

    public changeValue(value: number): void {
        this._value = value;
        this._updatedAt = new Date();
    }

    public changeComment(comment: string): void {
        this._comment = comment;
        this._updatedAt = new Date();
    }
}
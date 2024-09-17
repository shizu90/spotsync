import { Model } from "src/common/core/common.model";
import { User } from "src/user/domain/user.model";
import { CommentSubject } from "./comment-subject.model.";

export class Comment extends Model {
    private _id: string;
    private _text: string;
    private _user: User;
    private _subject: CommentSubject;
    private _subjectId: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        text: string,
        user: User,
        subject: CommentSubject,
        subjectId: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super()

        this._id = id;
        this._text = text;
        this._user = user;
        this._subject = subject;
        this._subjectId = subjectId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    public static create(
        id: string,
        text: string,
        user: User,
        subject: CommentSubject,
        subjectId: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        return new Comment(id, text, user, subject, subjectId, createdAt, updatedAt);
    }

    public id(): string {
        return this._id;
    }

    public text(): string {
        return this._text;
    }

    public user(): User {
        return this._user;
    }

    public subject(): CommentSubject {
        return this._subject;
    }

    public subjectId(): string {
        return this._subjectId;
    }

    public createdAt(): Date {
        return this._createdAt;
    }

    public updatedAt(): Date {
        return this._updatedAt;
    }

    public changeText(text: string) {
        this._text = text;
        this._updatedAt = new Date();
    }
}
import { Model } from "src/common/core/common.model";
import { User } from "src/user/domain/user.model";
import { CommentSubject } from "./comment-subject.model.";
import { Commentable } from "./commentable.interface";

export class Comment extends Model {
    private _id: string;
    private _text: string;
    private _user: User;
    private _subject: CommentSubject;
    private _commentable: Commentable;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        text: string,
        user: User,
        subject: CommentSubject,
        commentable: Commentable,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super()

        this._id = id;
        this._text = text;
        this._user = user;
        this._subject = subject;
        this._commentable = commentable;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    public static create(
        id: string,
        text: string,
        user: User,
        subject: CommentSubject,
        commentable: Commentable,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        return new Comment(id, text, user, subject, commentable, createdAt, updatedAt);
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

    public commentable(): Commentable {
        return this._commentable;
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
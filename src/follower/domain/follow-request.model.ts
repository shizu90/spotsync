import { Model } from "src/common/common.model";
import { User } from "src/user/domain/user.model";
import { Follow } from "./follow.model";
import { randomUUID } from "crypto";

export class FollowRequest extends Model 
{
    private _id: string;
    private _from: User;
    private _to: User;
    private _requestedOn: Date;

    private constructor(id: string, from: User, to: User, requestedOn?: Date) 
    {
        super();
        this._id = id;
        this._from = from;
        this._to = to;
        this._requestedOn = requestedOn;
    }

    public static create(id: string, from: User, to: User, requestedOn?: Date): FollowRequest 
    {
        return new FollowRequest(id, from, to, requestedOn);
    }

    public id(): string 
    {
        return this._id;
    }

    public from(): User 
    {
        return this._from;
    }

    public to(): User 
    {
        return this._to;
    }

    public requestedOn(): Date
    {
        return this._requestedOn;
    }

    public accept(): Follow 
    {
        return Follow.create(randomUUID(), this._from, this._to);
    }
}
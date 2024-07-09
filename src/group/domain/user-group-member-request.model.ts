import { Model } from "src/common/common.model";
import { UserGroup } from "./user-group.model";
import { User } from "src/user/domain/user.model";
import { UserGroupMember } from "./user-group-member.model";
import { UserGroupRole } from "./user-group-role.model";
import { randomUUID } from "crypto";

export class UserGroupMemberRequest extends Model 
{
    private _id: string;
    private _group: UserGroup;
    private _user: User;
    private _requestedOn: Date;

    private constructor(id: string, group: UserGroup, user: User, requestedOn?: Date) 
    {
        super();
        this._id = id;
        this._group = group;
        this._user = user;
        this._requestedOn = requestedOn ?? new Date();
    }

    public static create(id: string, group: UserGroup, user: User, requestedOn?: Date): UserGroupMemberRequest 
    {
        return new UserGroupMemberRequest(id, group, user, requestedOn);
    }

    public id(): string 
    {
        return this._id;
    }

    public group(): UserGroup 
    {
        return this._group;
    }

    public user(): User 
    {
        return this._user;
    }

    public requestedOn(): Date 
    {
        return this._requestedOn;
    }

    public accept(role: UserGroupRole): UserGroupMember 
    {
        return UserGroupMember.create(randomUUID(), this._group, this._user, role, false);
    }
}
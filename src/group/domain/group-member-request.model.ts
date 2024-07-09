import { Model } from "src/common/common.model";
import { UserGroup } from "./user-group.model";
import { User } from "src/user/domain/user.model";
import { GroupMember } from "./group-member.model";
import { GroupRole } from "./group-role.model";

export class GroupMemberRequest extends Model 
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

    public static create(id: string, group: UserGroup, user: User, requestedOn?: Date): GroupMemberRequest 
    {
        return new GroupMemberRequest(id, group, user, requestedOn);
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

    public accept(role: GroupRole): GroupMember 
    {
        return GroupMember.create(this._group, this._user, role);
    }
}
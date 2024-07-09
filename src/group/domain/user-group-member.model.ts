import { Model } from "src/common/common.model";
import { UserGroup } from "./user-group.model";
import { User } from "src/user/domain/user.model";
import { UserGroupRole } from "./user-group-role.model";

export class UserGroupMember extends Model 
{
    private _id: string;
    private _group: UserGroup;
    private _user: User;
    private _role: UserGroupRole;
    private _isCreator: boolean;
    private _joinedAt: Date;
    private _leftAt: Date;
    private _left: boolean;

    private constructor(
        id: string,
        group: UserGroup,
        user: User,
        role: UserGroupRole,
        isCreator: boolean,
        joinedAt?: Date,
        leftAt?: Date,
        left?: boolean
    ) 
    {
        super();
        this._id = id;
        this._group = group;
        this._user = user;
        this._role = role;
        this._isCreator = isCreator;
        this._joinedAt = joinedAt ?? new Date();
        this._leftAt = leftAt ?? null;
        this._left = left ?? false;
    }

    public static create(
        id: string,
        group: UserGroup,
        user: User,
        role: UserGroupRole,
        isCreator: boolean,
        joinedAt?: Date,
        leftAt?: Date,
        left?: boolean
    ): UserGroupMember
    {
        return new UserGroupMember(id, group, user, role, isCreator, joinedAt, leftAt, left);
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

    public role(): UserGroupRole 
    {
        return this._role;
    }

    public isCreator(): boolean 
    {
        return this._isCreator;
    }

    public joinedAt(): Date 
    {
        return this._joinedAt;
    }

    public leftAt(): Date 
    {
        return this._leftAt;
    }

    public left(): boolean
    {
        return this._left;
    }

    public leaveGroup(): void 
    {
        this._left = true;
        this._leftAt = new Date();
    }

    public changeRole(role: UserGroupRole): void 
    {
        this._role = role;
    }
}
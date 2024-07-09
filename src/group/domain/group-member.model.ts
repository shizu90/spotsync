import { Model } from "src/common/common.model";
import { UserGroup } from "./user-group.model";
import { User } from "src/user/domain/user.model";
import { GroupRole } from "./group-role.model";

export class GroupMember extends Model 
{
    private _group: UserGroup;
    private _user: User;
    private _role: GroupRole;
    private _joinedAt: Date;
    private _leftAt: Date;
    private _left: boolean;

    private constructor(
        group: UserGroup,
        user: User,
        role: GroupRole,
        joinedAt?: Date,
        leftAt?: Date,
        left?: boolean
    ) 
    {
        super();
        this._group = group;
        this._user = user;
        this._role = role;
        this._joinedAt = joinedAt ?? new Date();
        this._leftAt = leftAt ?? null;
        this._left = left ?? false;
    }

    public static create(
        group: UserGroup,
        user: User,
        role: GroupRole,
        joinedAt?: Date,
        leftAt?: Date,
        left?: boolean
    ): GroupMember
    {
        return new GroupMember(group, user, role, joinedAt, leftAt, left);
    }

    public group(): UserGroup 
    {
        return this._group;
    }

    public user(): User 
    {
        return this._user;
    }

    public role(): GroupRole 
    {
        return this._role;
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

    public changeRole(role: GroupRole): void 
    {
        this._role = role;
    }
}
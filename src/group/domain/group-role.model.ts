import { Model } from "src/common/common.model";
import { GroupPermission } from "./group-permission.model";

export class GroupRole extends Model 
{
    private _id: string;
    private _name: string;
    private _permissions: Array<GroupPermission>;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        name: string,
        permissions: Array<GroupPermission>,
        createdAt?: Date,
        updatedAt?: Date
    ) 
    {
        super();
        this._id = id;
        this._name = name;
        this._permissions = permissions;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
    }

    public static create(
        id: string,
        name: string,
        permissions: Array<GroupPermission>,
        createdAt?: Date,
        updatedAt?: Date
    ): GroupRole 
    {
        return new GroupRole(id, name, permissions, createdAt, updatedAt);
    }

    public id(): string 
    {
        return this._id;
    }

    public name(): string 
    {
        return this._name;
    }

    public permissions(): Array<GroupPermission> 
    {
        return this._permissions;
    }

    public createdAt(): Date 
    {
        return this._createdAt;
    }

    public updatedAt(): Date 
    {
        return this._updatedAt;
    }

    public changeName(name: string): void 
    {
        this._name = name;
        this._updatedAt = new Date();
    }

    public addPermission(permission: GroupPermission): void 
    {
        this._permissions.push(permission);
        this._updatedAt = new Date();
    }

    public removePermission(permission: GroupPermission): void 
    {
        const index = this._permissions.findIndex((p) => p.id() === permission.id());
        this._permissions = this._permissions.splice(index, 1);
        this._updatedAt = new Date();
    }
}
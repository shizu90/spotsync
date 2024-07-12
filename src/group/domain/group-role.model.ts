import { Model } from "src/common/common.model";
import { GroupPermission } from "./group-permission.model";
import { Group } from "./group.model";

export class GroupRole extends Model 
{
    private _id: string;
    private _name: string;
    private _permissions: Array<GroupPermission>;
    private _hexColor: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _isImmutable: boolean;
    private _group: Group;

    private constructor(
        id: string,
        name: string,
        hexColor: string,
        permissions: Array<GroupPermission>,
        isImmutable?: boolean,
        group?: Group,
        createdAt?: Date,
        updatedAt?: Date,
    ) 
    {
        super();
        this._id = id;
        this._name = name;
        this._permissions = permissions;
        this._hexColor = hexColor;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
        this._isImmutable = isImmutable ?? true;
        this._group = group;
    }

    public static create(
        id: string,
        name: string,
        hexColor: string,
        permissions: Array<GroupPermission>,
        isImmutable?: boolean,
        group?: Group,
        createdAt?: Date,
        updatedAt?: Date,
    ): GroupRole 
    {
        return new GroupRole(id, name, hexColor, permissions, isImmutable, group, createdAt, updatedAt);
    }

    public id(): string 
    {
        return this._id;
    }

    public name(): string 
    {
        return this._name;
    }
    public hexColor(): string 
    {
        return this._hexColor;
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

    public isImmutable(): boolean 
    {
        return this._isImmutable;
    }

    public group(): Group 
    {
        return this._group;
    }

    public changeName(name: string): void 
    {
        if(!this._isImmutable) {
            this._name = name;
            this._updatedAt = new Date();
        }
    }

    public changeHexColor(hexColor: string): void 
    {
        if(!this._isImmutable) {
            this._hexColor = hexColor;
            this._updatedAt = new Date();
        }
    }

    public addPermission(permission: GroupPermission): void 
    {
        if(!this._isImmutable) {
            this._permissions.push(permission);
            this._updatedAt = new Date();
        }
    }

    public removePermission(permission: GroupPermission): void 
    {
        if(!this._isImmutable) {
            const index = this._permissions.findIndex((p) => p.id() === permission.id());
            this._permissions = this._permissions.splice(index, 1);
            this._updatedAt = new Date();
        }
    }   
}
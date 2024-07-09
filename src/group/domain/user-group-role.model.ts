import { Model } from "src/common/common.model";
import { UserGroupPermission } from "./user-group-permission.model";

export class UserGroupRole extends Model 
{
    private _id: string;
    private _name: string;
    private _permissions: Array<UserGroupPermission>;
    private _hexColor: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _canUpdate: boolean;

    private constructor(
        id: string,
        name: string,
        hexColor: string,
        permissions: Array<UserGroupPermission>,
        createdAt?: Date,
        updatedAt?: Date,
        canUpdate?: boolean
    ) 
    {
        super();
        this._id = id;
        this._name = name;
        this._permissions = permissions;
        this._hexColor = hexColor;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
        this._canUpdate = canUpdate ?? true;
    }

    public static create(
        id: string,
        name: string,
        hexColor: string,
        permissions: Array<UserGroupPermission>,
        createdAt?: Date,
        updatedAt?: Date
    ): UserGroupRole 
    {
        return new UserGroupRole(id, name, hexColor, permissions, createdAt, updatedAt);
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

    public permissions(): Array<UserGroupPermission> 
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
        if(this._canUpdate) {
            this._name = name;
            this._updatedAt = new Date();
        }
    }

    public changeHexColor(hexColor: string): void 
    {
        if(this._canUpdate) {
            this._hexColor = hexColor;
            this._updatedAt = new Date();
        }
    }

    public addPermission(permission: UserGroupPermission): void 
    {
        if(this._canUpdate) {
            this._permissions.push(permission);
            this._updatedAt = new Date();
        }
    }

    public removePermission(permission: UserGroupPermission): void 
    {
        if(this._canUpdate) {
            const index = this._permissions.findIndex((p) => p.id() === permission.id());
            this._permissions = this._permissions.splice(index, 1);
            this._updatedAt = new Date();
        }
    }   
}
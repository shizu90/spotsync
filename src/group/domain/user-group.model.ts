import { group } from "console";
import { create } from "domain";
import { Model } from "src/common/common.model";

export class UserGroup extends Model 
{
    private _id: string;
    private _name: string;
    private _about: string;
    private _groupPicture: string;
    private _bannerPicture: string;
    private _visibility: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        name: string,
        about: string,
        groupPicture: string,
        bannerPicture: string,
        visibility: string,
        createdAt?: Date,
        updatedAt?: Date
    ) 
    {
        super();
        this._id = id;
        this._name = name;
        this._about = about;
        this._groupPicture = groupPicture;
        this._bannerPicture = bannerPicture;
        this._visibility = visibility;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
    }

    public static create(
        id: string,
        name: string,
        about: string,
        groupPicture: string,
        bannerPicture: string,
        visibility: string,
        createdAt?: Date,
        updatedAt?: Date
    ): UserGroup
    {
        return new UserGroup(id, name, about, groupPicture, bannerPicture, visibility, createdAt, updatedAt);
    }

    public id(): string 
    {
        return this._id;
    }

    public name(): string 
    {
        return this._name;
    }

    public about(): string 
    {
        return this._about;
    }

    public groupPicture(): string 
    {
        return this._groupPicture;
    }

    public bannerPicture(): string 
    {
        return this._bannerPicture;
    }

    public visibility(): string 
    {
        return this._visibility;
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

    public changeAbout(about: string): void 
    {
        this._about = about;
        this._updatedAt = new Date();
    }

    public changeGroupPicture(groupPicture: string): void 
    {
        this._groupPicture = groupPicture;
        this._updatedAt = new Date();
    }

    public changeBannerPicture(bannerPicture: string): void 
    {
        this._bannerPicture = bannerPicture;
        this._updatedAt = new Date();
    }
}
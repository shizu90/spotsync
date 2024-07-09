import { Model } from "src/common/common.model";
import { UserGroupVisibility } from "./user-group-visibility.enum";

export class UserGroupVisibilityConfig extends Model 
{
    private _id: string;
    private _postVisibility: string;
    private _eventVisibility: string;
    private _groupVisibility: string;

    private constructor(
        id: string,
        postVisibility: string,
        eventVisibility: string,
        groupVisibility: string
    ) 
    {
        super();
        this._id = id;
        this._postVisibility = postVisibility;
        this._eventVisibility = eventVisibility;
        this._groupVisibility = groupVisibility;
    }

    public static create(
        id: string,
        postVisibility: string,
        eventVisibility: string,
        groupVisibility: string
    ): UserGroupVisibilityConfig 
    {
        return new UserGroupVisibilityConfig(id, postVisibility, eventVisibility, groupVisibility);
    }

    public id(): string 
    {
        return this._id;
    }

    public postVisibility(): string 
    {
        return this._postVisibility;
    }

    public eventVisibility(): string 
    {
        return this._eventVisibility;
    }

    public groupVisibility(): string 
    {
        return this._groupVisibility;
    }

    public changePostVisibility(postVisibility: UserGroupVisibility): void 
    {
        this._postVisibility = postVisibility;
    }

    public changeEventVisibility(eventVisibility: UserGroupVisibility): void 
    {
        this._eventVisibility = eventVisibility;
    }

    public changeGroupVisibility(groupVisibility: UserGroupVisibility): void 
    {
        this._groupVisibility = groupVisibility;
    }
}
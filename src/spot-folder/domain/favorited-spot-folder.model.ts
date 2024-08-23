import { Model } from "src/common/core/common.model";
import { User } from "src/user/domain/user.model";
import { SpotFolder } from "./spot-folder.model";

export class FavoritedSpotFolder extends Model 
{
    private _id: string;
    private _spotFolder: SpotFolder;
    private _user: User;
    private _favoritedAt: Date;

    private constructor(
        id: string,
        spotFolder: SpotFolder,
        user: User,
        favoritedAt?: Date,
    ) 
    {
        super();
        this._id = id;
        this._spotFolder = spotFolder;
        this._user = user;
        this._favoritedAt = favoritedAt ?? new Date();
    }

    public static create(
        id: string,
        spotFolder: SpotFolder,
        user: User,
        favoritedAt?: Date,
    ) 
    {
        return new FavoritedSpotFolder(id, spotFolder, user, favoritedAt);
    }

    public id(): string 
    {
        return this._id;
    }

    public spotFolder(): SpotFolder 
    {
        return this._spotFolder;
    }

    public user(): User 
    {
        return this._user;
    }

    public favoritedAt(): Date 
    {
        return this._favoritedAt;
    }
}
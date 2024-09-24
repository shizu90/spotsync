import { Model } from "src/common/core/common.model";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { Spot } from "src/spot/domain/spot.model";
import { User } from "src/user/domain/user.model";
import { FavoritableSubject } from "./favoritable-subject.enum";
import { Favoritable } from "./favoritable.interface";

export class Favorite extends Model {
    private _id: string;
    private _user: User;
    private _favoritableSubject: FavoritableSubject;
    private _favoritableId: string;
    private _favoritable: Favoritable;
    private _createdAt: Date;

    private constructor(
        id: string,
        user: User,
        favoritableSubject: FavoritableSubject,
        favoritableId: string,
        favoritable: Favoritable,
        createdAt?: Date,
    ) {
        super();
        this._id = id;
        this._user = user;
        this._favoritableSubject = favoritableSubject;
        this._favoritableId = favoritableId;
        this._favoritable = favoritable;
        this._createdAt = createdAt ?? new Date();
    }

    public static create(
        id: string,
        user: User,
        favoritableSubject: FavoritableSubject,
        favoritableId: string,
        favoritable: Favoritable,
        createdAt?: Date,
    ) {
        return new Favorite(id, user, favoritableSubject, favoritableId, favoritable, createdAt);
    }

    public static createForSpot(
        id: string,
        user: User,
        spotId: string,
        spot: Spot,
        createdAt?: Date,
    ) {
        return new Favorite(id, user, FavoritableSubject.SPOT, spotId, spot, createdAt);
    }

    public static createForSpotFolder(
        id: string,
        user: User,
        spotFolderId: string,
        spotFolder: SpotFolder,
        createdAt?: Date,
    ) {
        return new Favorite(id, user, FavoritableSubject.SPOT_FOLDER, spotFolderId, spotFolder, createdAt);
    }

    public static createForSpotEvent(
        id: string,
        user: User,
        spotEventId: string,
        spotEvent: SpotEvent,
        createdAt?: Date,
    ) {
        return new Favorite(id, user, FavoritableSubject.SPOT_EVENT, spotEventId, spotEvent, createdAt);
    }

    public id(): string {
        return this._id;
    }

    public user(): User {
        return this._user;
    }

    public favoritableSubject(): FavoritableSubject {
        return this._favoritableSubject;
    }

    public favoritableId(): string {
        return this._favoritableId;
    }

    public favoritable(): Favoritable {
        return this._favoritable;
    }

    public createdAt(): Date {
        return this._createdAt;
    }
}
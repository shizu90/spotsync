import { Model } from "src/common/common.model";
import { UserCredentials } from "./user-credentials.model";

export class User extends Model 
{
    private _id: string;
    private _profilePicture: string;
    private _bannerPicture: string;
    private _biograph: string;
    private _birthDate: Date;
    private _profileVisibility: string;
    private _credentials: UserCredentials;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _isDeleted: boolean;

    private constructor(
        id: string, 
        profilePicture: string, 
        bannerPicture: string, 
        biograph: string, 
        birthDate: Date, 
        profileVisibility: string,
        credentials: UserCredentials,
        createdAt?: Date,
        updatedAt?: Date
    ) 
    {
        super();
        this._id = id;
        this._profilePicture = profilePicture;
        this._bannerPicture = bannerPicture;
        this._biograph = biograph;
        this._birthDate = birthDate;
        this._profileVisibility = profileVisibility;
        this._credentials = credentials;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
        this._isDeleted = false;
    }

    public static create(
        id: string, 
        profilePicture: string, 
        bannerPicture: string, 
        biograph: string, 
        birthDate: Date, 
        profileVisibility: string,
        credentials: UserCredentials,
        createdAt?: Date,
        updatedAt?: Date
    ): User 
    {
        return new User(
            id, 
            profilePicture, 
            bannerPicture, 
            biograph, 
            birthDate, 
            profileVisibility, 
            credentials,
            createdAt,
            updatedAt
        );
    }

    public id(): string 
    {
        return this._id;
    }

    public profilePicture(): string 
    {
        return this._profilePicture;
    }

    public bannerPicture(): string
    {
        return this._bannerPicture;
    }

    public biograph(): string 
    {
        return this._biograph;
    }

    public birthDate(): Date
    {
        return this._birthDate;
    }

    public profileVisibility(): string 
    {
        return this._profileVisibility;
    }

    public credentials(): UserCredentials
    {
        return this._credentials;
    }

    public createdAt(): Date
    {
        return this._createdAt;
    }

    public updatedAt(): Date
    {
        return this._updatedAt;
    }

    public isDeleted(): boolean 
    {
        return this._isDeleted;
    }

    public changeProfilePicture(profilePicture: string): void 
    {
        this._profilePicture = profilePicture;
        this._updatedAt = new Date();
    }

    public changeBannerPicture(bannerPicture: string): void
    {
        this._bannerPicture = bannerPicture;
        this._updatedAt = new Date();
    }

    public changeBiograph(biograph: string): void
    {
        this._biograph = biograph;
        this._updatedAt = new Date();
    }

    public changeBirthDate(birthDate: Date): void
    {
        this._birthDate = birthDate;
        this._updatedAt = new Date();
    }

    public delete(): void 
    {
        this._isDeleted = true;
        this._updatedAt = new Date();
    }
}
import { Model } from "src/common/core/common.model";
import { UserVisibility } from "./user-visibility.enum";

export class UserProfile extends Model {
    private _id: string;
    private _birthDate: Date;
    private _displayName: string;
    private _themeColor: string;
    private _profilePicture: string;
    private _bannerPicture: string;
    private _biograph: string;
    private _visibility: UserVisibility;

    private constructor(
        id: string,
        birthDate: Date,
        displayName: string,
        themeColor?: string,
        profilePicture?: string,
        bannerPicture?: string,
        biograph?: string,
        visibility?: UserVisibility
    ) {
        super();
        this._id = id;
        this._birthDate = birthDate;
        this._displayName = displayName;
        this._themeColor = themeColor ?? '#000000';
        this._profilePicture = profilePicture ?? null;
        this._bannerPicture = bannerPicture ?? null;
        this._biograph = biograph ?? null;
        this._visibility = visibility ?? UserVisibility.PUBLIC;
    }

    public static create(
        id: string,
        birthDate: Date,
        displayName: string,
        themeColor?: string,
        profilePicture?: string,
        bannerPicture?: string,
        biograph?: string,
        visibility?: UserVisibility
    ): UserProfile {
        return new UserProfile(
            id,
            birthDate,
            displayName,
            themeColor,
            profilePicture,
            bannerPicture,
            biograph,
            visibility
        );
    }

    public id(): string {
        return this._id;
    }

    public birthDate(): Date {
        return this._birthDate;
    }

    public displayName(): string {
        return this._displayName;
    }

    public themeColor(): string {
        return this._themeColor;
    }

    public profilePicture(): string {
        return this._profilePicture;
    }

    public bannerPicture(): string {
        return this._bannerPicture;
    }

    public biograph(): string {
        return this._biograph;
    }

    public visibility(): UserVisibility {
        return this._visibility;
    }

    public changeBirthDate(birthDate: Date): void {
        this._birthDate = birthDate
    }

    public changeDisplayName(displayName: string): void {
        this._displayName = displayName;
    }

    public changeThemeColor(themeColor: string): void {
        this._themeColor = themeColor;
    }

    public changeProfilePicture(profilePicture: string): void {
        this._profilePicture = profilePicture;
    }

    public changeBannerPicture(bannerPicture: string): void {
        this._bannerPicture = bannerPicture;
    }

    public changeBiograph(biograph: string): void {
        this._biograph = biograph;
    }

    public changeVisibility(visibility: UserVisibility): void {
        this._visibility = visibility;
    }
}
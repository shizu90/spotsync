import { Model } from "src/common/common.model";
import { User } from "src/user/domain/user.model";
import { SpotAddress } from "./spot-address.model";
import { SpotPhoto } from "./spot-photo.model";

export class Spot extends Model 
{
    private _id: string;
    private _name: string;
    private _description: string;
    private _type: string;
    private _address: SpotAddress;
    private _photos: SpotPhoto[];
    private _creator: User;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        name: string,
        description: string,
        type: string,
        address: SpotAddress,
        photos: SpotPhoto[],
        creator: User,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super();
        this._id = id;
        this._name = name;
        this._description = description;
        this._type = type;
        this._address = address;
        this._photos = photos;
        this._creator = creator;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
    }

    public static create(
        id: string,
        name: string,
        description: string,
        type: string,
        address: SpotAddress,
        photos: SpotPhoto[],
        creator: User,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        return new Spot(id, name, description, type, address, photos, creator, createdAt, updatedAt);
    }

    public id(): string {
        return this._id;
    }

    public name(): string {
        return this._name;
    }

    public description(): string {
        return this._description;
    }

    public type(): string {
        return this._type;
    }

    public address(): SpotAddress {
        return this._address;
    }

    public photos(): SpotPhoto[] {
        return this._photos;
    }

    public creator(): User {
        return this._creator;
    }

    public createdAt(): Date {
        return this._createdAt;
    }

    public updatedAt(): Date {
        return this._updatedAt;
    }

    public changeName(name: string): void {
        this._name = name;
        this._updatedAt = new Date();
    }

    public changeDescription(description: string): void {
        this._description = description;
        this._updatedAt = new Date();
    }

    public changeType(type: string): void {
        this._type = type;
        this._updatedAt = new Date();
    }

    public changeAddress(address: SpotAddress): void {
        this._address = address;
        this._updatedAt = new Date();
    }

    public findPhoto(id: string): SpotPhoto {
        return this._photos.find(p => p.id() === id);
    }

    public addPhoto(photo: SpotPhoto): void {
        this._photos.push(photo);
        this._updatedAt = new Date();
    }

    public removePhoto(id: string): void {
        this._photos = this._photos.filter(p => p.id() !== id);
        this._updatedAt = new Date();
    }
}
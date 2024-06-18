import { Model } from "src/common/common.model";
import { User } from "src/user/domain/user.model";

export class UserAddress extends Model 
{
    private _id: string;
    private _name: string;
    private _area: string;
    private _subArea: string;
    private _locality: string;
    private _latitude: number;
    private _longitude: number;
    private _countryCode: string;
    private _main: boolean;
    private _user: User;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        name: string,
        area: string,
        subArea: string,
        locality: string,
        latitude: number,
        longitude: number,
        countryCode: string,
        main: boolean,
        user: User
    ) 
    {
        super();
        this._id = id;
        this._name = name;
        this._area = area;
        this._subArea = subArea;
        this._locality = locality;
        this._latitude = latitude;
        this._longitude = longitude;
        this._countryCode = countryCode;
        this._main = main;
        this._user = user;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    public static create(
        id: string,
        name: string,
        area: string,
        subArea: string,
        locality: string,
        latitude: number,
        longitude: number,
        countryCode: string,
        main: boolean,
        user: User
    ) 
    {
        return new UserAddress(
            id, 
            name, 
            area, 
            subArea, 
            locality, 
            latitude, 
            longitude, 
            countryCode, 
            main,
            user
        );
    }

    public id() 
    {
        return this._id;
    }

    public name() 
    {
        return this._name;
    }

    public area() 
    {
        return this._area;
    }

    public subArea() 
    {
        return this._subArea;
    }

    public locality() 
    {
        return this._locality;
    }

    public latitude() 
    {
        return this._latitude;
    }

    public longitude() 
    {
        return this._longitude;
    }

    public countryCode() 
    {
        return this._countryCode;
    }

    public main() 
    {
        return this._main;
    }

    public user() 
    {
        return this._user;
    }

    public changeName(name: string) 
    {
        this._name = name;
        this._updatedAt = new Date();
    }

    public changeArea(area: string) 
    {
        this._area = area;
        this._updatedAt = new Date();
    }

    public changeSubArea(subArea: string) 
    {
        this._subArea = subArea;
        this._updatedAt = new Date();
    }

    public changeLocality(locality: string) 
    {
        this._locality = locality;
        this._updatedAt = new Date();
    }

    public changeLatitude(latitude: number) 
    {
        this._latitude = latitude;
        this._updatedAt = new Date();
    }

    public changeLongitude(longitude: number) 
    {
        this._longitude = longitude;
        this._updatedAt = new Date();
    }

    public changeCountryCode(countryCode: string) 
    {
        this._countryCode = countryCode;
        this._updatedAt = new Date();
    }

    public changeMain(main: boolean) 
    {
        this._main = main;
        this._updatedAt = new Date();
    }
}
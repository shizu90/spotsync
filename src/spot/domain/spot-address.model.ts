import { Model } from "src/common/common.model";

export class SpotAddress extends Model 
{
    private _id: string;
    private _area: string;
    private _subArea: string;
    private _locality?: string;
    private _latitude: number;
    private _longitude: number;
    private _countryCode: string;

    private constructor(
        id: string,
        area: string,
        subArea: string,
        latitude: number,
        longitude: number,
        countryCode: string,
        locality?: string,
    ) {
        super();
        this._id = id;
        this._area = area;
        this._subArea = subArea;
        this._locality = locality;
        this._latitude = latitude;
        this._longitude = longitude;
        this._countryCode = countryCode;
    }

    public static create(
        id: string,
        area: string,
        subArea: string,
        latitude: number,
        longitude: number,
        countryCode: string,
        locality?: string,
    ) {
        return new SpotAddress(id, area, subArea, latitude, longitude, countryCode, locality);
    }

    public id(): string {
        return this._id;
    }

    public area(): string {
        return this._area;
    }

    public subArea(): string {
        return this._subArea;
    }

    public locality(): string {
        return this._locality;
    }

    public latitude(): number {
        return this._latitude;
    }

    public longitude(): number {
        return this._longitude;
    }

    public countryCode(): string {
        return this._countryCode;
    }

    public changeArea(area: string): void {
        this._area = area;
    }

    public changeSubArea(subArea: string): void {
        this._subArea = subArea;
    }

    public changeLocality(locality: string): void {
        this._locality = locality;
    }

    public changeLatitude(latitude: number): void {
        this._latitude = latitude;
    }

    public changeLongitude(longitude: number): void {
        this._longitude = longitude;
    }

    public changeCountryCode(countryCode: string): void {
        this._countryCode = countryCode;
    }
}
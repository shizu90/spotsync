import { Model } from "./common.model";

export class Pagination<M extends Model> 
{
    constructor(
        readonly items: Array<M>,
        readonly total: number,
        readonly currentPage: number,
        readonly lastPage: number
    ) 
    {}
}
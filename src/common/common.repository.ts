import { Model } from "./common.model";
import { SortDirection } from "./enums/sort-direction.enum";

export interface PaginateParameters 
{
    filters?: Object,
    sort?: string
    sortDirection?: SortDirection
    page?: number
    limit?: number,
    paginate?: boolean
}

export class Pagination<T> 
{
    public items: Array<T>;
    public total: number;
    public current_page: number;
    public next_page: boolean;

    constructor(
        items: Array<T>,
        total: number,
        current_page: number
    ) 
    {
        this.items = items;
        this.total = total;
        this.current_page = current_page;
        this.next_page = (items.length * current_page) < total;
    }
}

export interface Repository<M extends Model, I> 
{
    paginate(params: PaginateParameters): Promise<Pagination<M>>
    findBy(values: Object): Promise<Array<M>>;
    findById(id: I): Promise<M>;
    findAll(): Promise<Array<M>>;
    store(model: M): Promise<M>;
    update(model: M): Promise<M>;
    delete(id: I): Promise<void>;
}
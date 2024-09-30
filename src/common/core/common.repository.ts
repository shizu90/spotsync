import { SortDirection } from '../enums/sort-direction.enum';
import { Model } from './common.model';

export interface PaginateParameters {
	filters?: Object;
	sort?: string;
	sortDirection?: SortDirection;
	page?: number;
	limit?: number;
	paginate?: boolean;
}

export class Pagination<T> {
	public items: Array<T>;
	public total: number;
	public current_page: number;
	public last_page: number;
	public has_next_page: boolean;
	public limit: number;

	constructor(
		items: Array<T>,
		total: number,
		current_page: number,
		limit: number = 12,
	) {
		this.items = items;
		this.total = total;
		this.current_page = current_page;
		this.last_page = Math.ceil(total / limit) || 1;
		this.limit = limit;
		this.has_next_page = this.current_page + 1 < this.last_page;
	}
}

export interface Repository<M extends Model, I> {
	paginate(params: PaginateParameters): Promise<Pagination<M>>;
	findBy(values: Object): Promise<Array<M>>;
	countBy(values: Object): Promise<number>;
	findById(id: I): Promise<M>;
	findAll(): Promise<Array<M>>;
	store(model: M): Promise<M>;
	update(model: M): Promise<void>;
	delete(id: I): Promise<void>;
}

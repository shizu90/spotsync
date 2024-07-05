import { Model } from "./common.model";

export interface Repository<M extends Model, I> 
{
    findById(id: I): Promise<M>;
    findAll(): Promise<Array<M>>;
    store(model: M): Promise<M>;
    update(model: M): Promise<M>;
    delete(id: I): Promise<void>;
}
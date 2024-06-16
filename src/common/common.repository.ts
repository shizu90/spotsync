import { Model } from "./common.model";

export interface Repository<M extends Model, I> 
{
    findById(id: I): M;
    findAll(): Array<M>;
    store(model: M): M;
    update(model: M): M;
    delete(id: I): void;
}
import { Model } from './common.model';

export interface EntityMapper<M extends Model, E extends any> {
	toModel(entity: any): Model;
	toEntity(model: Model): any;
}

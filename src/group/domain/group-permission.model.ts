import { Model } from 'src/common/common.model';

export class GroupPermission extends Model {
	private _id: string;
	private _name: string;

	private constructor(id: string, name: string) {
		super();
		this._id = id;
		this._name = name;
	}

	public static create(id: string, name: string): GroupPermission {
		return new GroupPermission(id, name);
	}

	public id(): string {
		return this._id;
	}

	public name(): string {
		return this._name;
	}
}

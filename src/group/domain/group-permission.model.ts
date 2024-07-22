import { Model } from 'src/common/common.model';
import { PermissionName } from './permission-name.enum';

export class GroupPermission extends Model {
	private _id: string;
	private _name: PermissionName;

	private constructor(id: string, name: PermissionName) {
		super();
		this._id = id;
		this._name = name;
	}

	public static create(id: string, name: PermissionName): GroupPermission {
		return new GroupPermission(id, name);
	}

	public id(): string {
		return this._id;
	}

	public name(): PermissionName {
		return this._name;
	}
}

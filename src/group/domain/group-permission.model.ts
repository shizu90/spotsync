import { Model } from 'src/common/common.model';
import { GroupPermissionName } from './group-permission-name.enum';

export class GroupPermission extends Model {
	private _id: string;
	private _name: GroupPermissionName;

	private constructor(id: string, name: GroupPermissionName) {
		super();
		this._id = id;
		this._name = name;
	}

	public static create(
		id: string,
		name: GroupPermissionName,
	): GroupPermission {
		return new GroupPermission(id, name);
	}

	public id(): string {
		return this._id;
	}

	public name(): GroupPermissionName {
		return this._name;
	}
}

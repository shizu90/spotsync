import { Model } from 'src/common/common.model';
import { User } from 'src/user/domain/user.model';
import { Group } from './group.model';
import { GroupRole } from './group-role.model';
import { PermissionName } from './permission-name.enum';

export class GroupMember extends Model {
	private _id: string;
	private _group: Group;
	private _user: User;
	private _role: GroupRole;
	private _isCreator: boolean;
	private _joinedAt: Date;

	private constructor(
		id: string,
		group: Group,
		user: User,
		role: GroupRole,
		isCreator: boolean,
		joinedAt?: Date,
	) {
		super();
		this._id = id;
		this._group = group;
		this._user = user;
		this._role = role;
		this._isCreator = isCreator;
		this._joinedAt = joinedAt ?? new Date();
	}

	public static create(
		id: string,
		group: Group,
		user: User,
		role: GroupRole,
		isCreator: boolean,
		joinedAt?: Date,
	): GroupMember {
		return new GroupMember(id, group, user, role, isCreator, joinedAt);
	}

	public id(): string {
		return this._id;
	}

	public group(): Group {
		return this._group;
	}

	public user(): User {
		return this._user;
	}

	public role(): GroupRole {
		return this._role;
	}

	public isCreator(): boolean {
		return this._isCreator;
	}

	public joinedAt(): Date {
		return this._joinedAt;
	}

	public changeRole(role: GroupRole): void {
		this._role = role;
	}

	public canExecute(permissionName: PermissionName): boolean {
		return this._isCreator || this._role.hasPermission(permissionName);
	}
}

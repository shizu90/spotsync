import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';
import { GroupMemberStatus } from './group-member-status.enum';
import { GroupPermissionName } from './group-permission-name.enum';
import { GroupRole } from './group-role.model';
import { Group } from './group.model';

export class GroupMember extends Model {
	private _id: string;
	private _group: Group;
	private _user: User;
	private _role: GroupRole;
	private _status: GroupMemberStatus;
	private _isCreator: boolean;
	private _joinedAt: Date;
	private _requestedAt: Date;

	private constructor(
		id: string,
		group: Group,
		user: User,
		role: GroupRole,
		isCreator: boolean,
		status?: GroupMemberStatus,
		joinedAt?: Date,
		requestedAt?: Date,
	) {
		super();
		this._id = id;
		this._group = group;
		this._user = user;
		this._role = role;
		this._isCreator = isCreator;
		this._status = status ?? GroupMemberStatus.REQUESTED;
		this._joinedAt = joinedAt;
		this._requestedAt = requestedAt;
	}

	public static create(
		id: string,
		group: Group,
		user: User,
		role: GroupRole,
		isCreator: boolean,
		status?: GroupMemberStatus,
		joinedAt?: Date,
		requestedAt?: Date,
	): GroupMember {
		return new GroupMember(
			id,
			group,
			user,
			role,
			isCreator,
			status,
			joinedAt,
			requestedAt,
		);
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

	public status(): GroupMemberStatus {
		return this._status;
	}

	public joinedAt(): Date {
		return this._joinedAt;
	}

	public requestedAt(): Date {
		return this._requestedAt;
	}

	public changeRole(role: GroupRole): void {
		this._role = role;
	}

	public canExecute(GroupPermissionName: GroupPermissionName): boolean {
		return this._isCreator || this._role.hasPermission(GroupPermissionName);
	}

	public accept(): void {
		this._status = GroupMemberStatus.ACTIVE;
		this._joinedAt = new Date();
	}

	public request(): void {
		this._status = GroupMemberStatus.REQUESTED;
		this._requestedAt = new Date();
		this._joinedAt = null;
	}

	public isRequested(): boolean {
		return this._status === GroupMemberStatus.REQUESTED;
	}

	public isActive(): boolean {
		return this._status === GroupMemberStatus.ACTIVE;
	}

	public isInactive(): boolean {
		return this._status === GroupMemberStatus.INACTIVE;
	}
}

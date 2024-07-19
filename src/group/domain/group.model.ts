import { Model } from 'src/common/common.model';
import { GroupVisibilityConfig } from './group-visibility-config.model';
import { GroupMember } from './group-member.model';
import { User } from 'src/user/domain/user.model';
import { GroupRole } from './group-role.model';
import { randomUUID } from 'crypto';
import { GroupVisibility } from './group-visibility.enum';
import { GroupMemberRequest } from './group-member-request.model';
import { GroupLog } from './group-log.model';

export class Group extends Model {
	private _id: string;
	private _name: string;
	private _about: string;
	private _groupPicture: string;
	private _bannerPicture: string;
	private _visibilityConfiguration: GroupVisibilityConfig;
	private _createdAt: Date;
	private _updatedAt: Date;
	private _isDeleted: boolean;

	private constructor(
		id: string,
		name: string,
		about: string,
		groupPicture: string,
		bannerPicture: string,
		visibilityConfiguration: GroupVisibilityConfig,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		super();
		this._id = id;
		this._name = name;
		this._about = about;
		this._groupPicture = groupPicture;
		this._bannerPicture = bannerPicture;
		this._visibilityConfiguration = visibilityConfiguration;
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();
		this._isDeleted = isDeleted ?? false;
	}

	public static create(
		id: string,
		name: string,
		about: string,
		groupPicture: string,
		bannerPicture: string,
		visibilityConfiguration: GroupVisibilityConfig,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	): Group {
		return new Group(
			id,
			name,
			about,
			groupPicture,
			bannerPicture,
			visibilityConfiguration,
			createdAt,
			updatedAt,
			isDeleted,
		);
	}

	public id(): string {
		return this._id;
	}

	public name(): string {
		return this._name;
	}

	public about(): string {
		return this._about;
	}

	public groupPicture(): string {
		return this._groupPicture;
	}

	public bannerPicture(): string {
		return this._bannerPicture;
	}

	public visibilityConfiguration(): GroupVisibilityConfig {
		return this._visibilityConfiguration;
	}

	public createdAt(): Date {
		return this._createdAt;
	}

	public updatedAt(): Date {
		return this._updatedAt;
	}

	public isDeleted(): boolean {
		return this._isDeleted;
	}

	public changeName(name: string): void {
		this._name = name;
		this._updatedAt = new Date();
	}

	public changeAbout(about: string): void {
		this._about = about;
		this._updatedAt = new Date();
	}

	public changeGroupPicture(groupPicture: string): void {
		this._groupPicture = groupPicture;
		this._updatedAt = new Date();
	}

	public changeBannerPicture(bannerPicture: string): void {
		this._bannerPicture = bannerPicture;
		this._updatedAt = new Date();
	}

	public changeVisibilityConfig(
		visibilityConfig: GroupVisibilityConfig,
	): void {
		this._visibilityConfiguration = visibilityConfig;
		this._updatedAt = new Date();
	}

	public delete(): void {
		this._isDeleted = true;
		this._updatedAt = new Date();
	}

	public createVisibilityConfig(
		groupVisibility: GroupVisibility,
		postVisibility: GroupVisibility,
		eventVisibility: GroupVisibility,
	): GroupVisibilityConfig {
		const groupVisibilityConfig = GroupVisibilityConfig.create(
			this._id,
			groupVisibility,
			postVisibility,
			eventVisibility,
		);

		this._visibilityConfiguration = groupVisibilityConfig;

		return groupVisibilityConfig;
	}

	public joinGroup(
		user: User,
		role: GroupRole,
		isCreator: boolean = false,
	): GroupMember | GroupMemberRequest {
		if (
			!isCreator &&
			this._visibilityConfiguration.groupVisibility() ===
				GroupVisibility.PRIVATE
		) {
			return this.requestMembership(user);
		} else {
			return this.addMember(user, role, isCreator);
		}
	}

	public addMember(
		user: User,
		role: GroupRole,
		isCreator: boolean = false,
	): GroupMember {
		const groupMember = GroupMember.create(
			randomUUID(),
			this,
			user,
			role,
			isCreator,
		);

		return groupMember;
	}

	public requestMembership(user: User): GroupMemberRequest {
		const groupMemberRequest = GroupMemberRequest.create(
			randomUUID(),
			this,
			user,
		);

		return groupMemberRequest;
	}

	public newLog(text: string): GroupLog {
		const groupLog = GroupLog.create(randomUUID(), this, text);

		return groupLog;
	}
}

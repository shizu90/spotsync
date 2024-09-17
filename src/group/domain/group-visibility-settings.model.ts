import { Model } from 'src/common/core/common.model';
import { GroupVisibility } from './group-visibility.enum';

export class GroupVisibilitySettings extends Model {
	private _id: string;
	private _posts: GroupVisibility;
	private _spotEvents: GroupVisibility;
	private _groups: GroupVisibility;

	private constructor(
		id: string,
		posts: GroupVisibility,
		spotEvents: GroupVisibility,
		groups: GroupVisibility,
	) {
		super();
		this._id = id;
		this._posts = posts;
		this._spotEvents = spotEvents;
		this._groups = groups;
	}

	public static create(
		id: string,
		posts: GroupVisibility,
		spotEvents: GroupVisibility,
		groups: GroupVisibility,
	): GroupVisibilitySettings {
		return new GroupVisibilitySettings(id, posts, spotEvents, groups);
	}

	public id(): string {
		return this._id;
	}

	public posts(): GroupVisibility {
		return this._posts;
	}

	public spotEvents(): GroupVisibility {
		return this._spotEvents;
	}

	public groups(): GroupVisibility {
		return this._groups;
	}

	public changePosts(posts: GroupVisibility): void {
		this._posts = posts;
	}

	public changeSpotEvents(spotEvents: GroupVisibility): void {
		this._spotEvents = spotEvents;
	}

	public changeGroups(groups: GroupVisibility): void {
		this._groups = groups;
	}
}

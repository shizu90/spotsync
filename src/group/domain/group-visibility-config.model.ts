import { Model } from 'src/common/common.model';
import { GroupVisibility } from './group-visibility.enum';

export class GroupVisibilityConfig extends Model {
	private _id: string;
	private _posts: string;
	private _spotEvents: string;
	private _groups: string;

	private constructor(
		id: string,
		posts: string,
		spotEvents: string,
		groups: string,
	) {
		super();
		this._id = id;
		this._posts = posts;
		this._spotEvents = spotEvents;
		this._groups = groups;
	}

	public static create(
		id: string,
		posts: string,
		spotEvents: string,
		groups: string,
	): GroupVisibilityConfig {
		return new GroupVisibilityConfig(id, posts, spotEvents, groups);
	}

	public id(): string {
		return this._id;
	}

	public posts(): string {
		return this._posts;
	}

	public spotEvents(): string {
		return this._spotEvents;
	}

	public groups(): string {
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

import { Model } from 'src/common/common.model';
import { GroupVisibility } from './group-visibility.enum';

export class GroupVisibilityConfig extends Model {
	private _id: string;
	private _postVisibility: string;
	private _eventVisibility: string;
	private _groupVisibility: string;

	private constructor(
		id: string,
		postVisibility: string,
		eventVisibility: string,
		groupVisibility: string,
	) {
		super();
		this._id = id;
		this._postVisibility = postVisibility;
		this._eventVisibility = eventVisibility;
		this._groupVisibility = groupVisibility;
	}

	public static create(
		id: string,
		postVisibility: string,
		eventVisibility: string,
		groupVisibility: string,
	): GroupVisibilityConfig {
		return new GroupVisibilityConfig(
			id,
			postVisibility,
			eventVisibility,
			groupVisibility,
		);
	}

	public id(): string {
		return this._id;
	}

	public postVisibility(): string {
		return this._postVisibility;
	}

	public eventVisibility(): string {
		return this._eventVisibility;
	}

	public groupVisibility(): string {
		return this._groupVisibility;
	}

	public changePostVisibility(postVisibility: GroupVisibility): void {
		this._postVisibility = postVisibility;
	}

	public changeEventVisibility(eventVisibility: GroupVisibility): void {
		this._eventVisibility = eventVisibility;
	}

	public changeGroupVisibility(groupVisibility: GroupVisibility): void {
		this._groupVisibility = groupVisibility;
	}
}

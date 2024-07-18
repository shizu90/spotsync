import { Model } from 'src/common/common.model';
import { UserVisibility } from './user-visibility.enum';

export class UserVisibilityConfig extends Model {
	private _id: string;
	private _profileVisibility: string;
	private _addressVisibility: string;
	private _poiFolderVisibility: string;
	private _visitedPoiVisibility: string;
	private _postVisibility: string;

	private constructor(
		id: string,
		profileVisibility: string,
		addressVisibility: string,
		poiFolderVisibility: string,
		visitedPoiVisibility: string,
		postVisibility: string,
	) {
		super();
		this._id = id;
		this._profileVisibility = profileVisibility;
		this._addressVisibility = addressVisibility;
		this._poiFolderVisibility = poiFolderVisibility;
		this._visitedPoiVisibility = visitedPoiVisibility;
		this._postVisibility = postVisibility;
	}

	public static create(
		id: string,
		profileVisibility: string,
		addressVisibility: string,
		poiFolderVisibility: string,
		visitedPoiVisibility: string,
		postVisibility: string,
	): UserVisibilityConfig {
		return new UserVisibilityConfig(
			id,
			profileVisibility,
			addressVisibility,
			poiFolderVisibility,
			visitedPoiVisibility,
			postVisibility,
		);
	}

	public id(): string {
		return this._id;
	}

	public profileVisibility(): string {
		return this._profileVisibility;
	}

	public addressVisibility(): string {
		return this._addressVisibility;
	}

	public poiFolderVisibility(): string {
		return this._poiFolderVisibility;
	}

	public visitedPoiVisibility(): string {
		return this._visitedPoiVisibility;
	}

	public postVisibility(): string {
		return this._postVisibility;
	}

	public changeProfileVisibility(profileVisibility: UserVisibility): void {
		this._profileVisibility = profileVisibility;
	}

	public changeAddressVisibility(addressVisibility: UserVisibility): void {
		this._addressVisibility = addressVisibility;
	}

	public changePoiFolderVisibility(
		poiFolderVisibility: UserVisibility,
	): void {
		this._poiFolderVisibility = poiFolderVisibility;
	}

	public changeVisitedPoiVisibility(
		visitedPoiVisibility: UserVisibility,
	): void {
		this._visitedPoiVisibility = visitedPoiVisibility;
	}

	public changePostVisibility(postVisibility: UserVisibility): void {
		this._postVisibility = postVisibility;
	}
}

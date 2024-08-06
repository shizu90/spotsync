import { Model } from 'src/common/core/common.model';
import { UserVisibility } from './user-visibility.enum';

export class UserVisibilityConfig extends Model {
	private _id: string;
	private _profile: UserVisibility;
	private _addresses: UserVisibility;
	private _spotFolders: UserVisibility;
	private _visitedSpots: UserVisibility;
	private _posts: UserVisibility;
	private _favoriteSpots: UserVisibility;
	private _favoriteSpotFolders: UserVisibility;
	private _favoriteSpotEvents: UserVisibility;

	private constructor(
		id: string,
		profile: UserVisibility,
		addresses: UserVisibility,
		spotFolders: UserVisibility,
		visitedSpots: UserVisibility,
		posts: UserVisibility,
		favoriteSpots: UserVisibility,
		favoriteSpotFolders: UserVisibility,
		favoriteSpotEvents: UserVisibility,
	) {
		super();
		this._id = id;
		this._profile = profile;
		this._addresses = addresses;
		this._spotFolders = spotFolders;
		this._visitedSpots = visitedSpots;
		this._posts = posts;
		this._favoriteSpots = favoriteSpots;
		this._favoriteSpotFolders = favoriteSpotFolders;
		this._favoriteSpotEvents = favoriteSpotEvents;
	}

	public static create(
		id: string,
		profile: UserVisibility,
		addresses: UserVisibility,
		spotFolders: UserVisibility,
		visitedSpots: UserVisibility,
		posts: UserVisibility,
		favoriteSpots: UserVisibility,
		favoriteSpotFolders: UserVisibility,
		favoriteSpotEvents: UserVisibility,
	): UserVisibilityConfig {
		return new UserVisibilityConfig(
			id,
			profile,
			addresses,
			spotFolders,
			visitedSpots,
			posts,
			favoriteSpots,
			favoriteSpotFolders,
			favoriteSpotEvents,
		);
	}

	public id(): string {
		return this._id;
	}

	public profile(): UserVisibility {
		return this._profile;
	}

	public addresses(): UserVisibility {
		return this._addresses;
	}

	public spotFolders(): UserVisibility {
		return this._spotFolders;
	}

	public visitedSpots(): UserVisibility {
		return this._visitedSpots;
	}

	public posts(): UserVisibility {
		return this._posts;
	}

	public favoriteSpots(): UserVisibility {
		return this._favoriteSpots;
	}

	public favoriteSpotFolders(): UserVisibility {
		return this._favoriteSpotFolders;
	}

	public favoriteSpotEvents(): UserVisibility {
		return this._favoriteSpotEvents;
	}

	public changeProfile(profile: UserVisibility): void {
		this._profile = profile;
	}

	public changeAddresses(addresses: UserVisibility): void {
		this._addresses = addresses;
	}

	public changeSpotFolders(spotFolders: UserVisibility): void {
		this._spotFolders = spotFolders;
	}

	public changeVisitedSpots(visitedSpots: UserVisibility): void {
		this._visitedSpots = visitedSpots;
	}

	public changePosts(posts: UserVisibility): void {
		this._posts = posts;
	}

	public changeFavoriteSpots(favoriteSpots: UserVisibility): void {
		this._favoriteSpots = favoriteSpots;
	}

	public changeFavoriteSpotFolders(
		favoriteSpotFolders: UserVisibility,
	): void {
		this._favoriteSpotFolders = favoriteSpotFolders;
	}

	public changeFavoriteSpotEvents(favoriteSpotEvents: UserVisibility): void {
		this._favoriteSpotEvents = favoriteSpotEvents;
	}
}

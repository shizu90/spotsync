import { Model } from 'src/common/common.model';
import { UserVisibility } from './user-visibility.enum';

export class UserVisibilityConfig extends Model {
	private _id: string;
	private _profile: string;
	private _addresses: string;
	private _spotFolders: string;
	private _visitedSpots: string;
	private _posts: string;
	private _favoriteSpots: string;
	private _favoriteSpotFolders: string;
	private _favoriteSpotEvents: string;

	private constructor(
		id: string,
		profile: string,
		addresses: string,
		spotFolders: string,
		visitedSpots: string,
		posts: string,
		favoriteSpots: string,
		favoriteSpotFolders: string,
		favoriteSpotEvents: string,
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
		profile: string,
		addresses: string,
		spotFolders: string,
		visitedSpots: string,
		posts: string,
		favoriteSpots: string,
		favoriteSpotFolders: string,
		favoriteSpotEvents: string,
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

	public profile(): string {
		return this._profile;
	}

	public addresses(): string {
		return this._addresses;
	}

	public spotFolders(): string {
		return this._spotFolders;
	}

	public visitedSpots(): string {
		return this._visitedSpots;
	}

	public posts(): string {
		return this._posts;
	}

	public favoriteSpots(): string {
		return this._favoriteSpots;
	}

	public favoriteSpotFolders(): string {
		return this._favoriteSpotFolders;
	}

	public favoriteSpotEvents(): string {
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

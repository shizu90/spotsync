import { Model } from 'src/common/core/common.model';

export class SpotPhoto extends Model {
	private _id: string;
	private _filePath: string;

	private constructor(id: string, filePath: string) {
		super();
		this._id = id;
		this._filePath = filePath;
	}

	public static create(id: string, filePath: string) {
		return new SpotPhoto(id, filePath);
	}

	public id(): string {
		return this._id;
	}

	public filePath(): string {
		return this._filePath;
	}
}

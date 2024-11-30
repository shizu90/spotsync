import { Model } from 'src/common/core/common.model';

export class SpotPhoto extends Model {
	private _id: string;
	private _filePath: string;
	private _fileContent: string;
	private _fileType: string;

	private constructor(id: string, filePath: string, fileContent: string, fileType: string) {
		super();
		this._id = id;
		this._filePath = filePath;
		this._fileContent = fileContent;
		this._fileType = fileType;
	}

	public static create(id: string, filePath: string, fileContent: string, fileType: string): SpotPhoto {
		return new SpotPhoto(id, filePath, fileContent, fileType);
	}

	public id(): string {
		return this._id;
	}

	public filePath(): string {
		return this._filePath;
	}

	public fileContent(): string {
		return this._fileContent;
	}

	public fileType(): string {
		return this._fileType;
	}
}

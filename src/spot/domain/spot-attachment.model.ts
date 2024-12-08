import { Model } from 'src/common/core/common.model';

export class SpotAttachment extends Model {
	private _id: string;
	private _filePath: string;
	private _fileType: string;

	private constructor(id: string, filePath: string, fileType: string) {
		super();
		this._id = id;
		this._filePath = filePath;
		this._fileType = fileType;
	}

	public static create(id: string, filePath: string, fileType: string): SpotAttachment {
		return new SpotAttachment(id, filePath, fileType);
	}

	public id(): string {
		return this._id;
	}

	public filePath(): string {
		return this._filePath;
	}

	public fileType(): string {
		return this._fileType;
	}
}

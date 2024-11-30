import * as path from "path";

export type Path = string;
export type Content = string;

export const FileStorageProvider = "FileStorage";

export class SavedFile {
    public path: Path;
    public content: Content;

    public constructor(path: Path, content: Content) {
        this.path = path;
        this.content = content;
    }
}

export abstract class FileStorage {
    protected basePath: Path;
    
    protected constructor() {
        this.basePath = path.join(__dirname, "../../files");
    }

    public abstract save(path: Path, file: Express.Multer.File): Promise<SavedFile>;
    public abstract delete(path: Path): Promise<void>;
    public abstract get(path: Path): Promise<Buffer>;
}
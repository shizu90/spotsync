import { ReadStream } from "fs";

export type Path = string;

export const FileStorageProvider = "FileStorage";

export class SavedFile {
    public path: Path;

    public constructor(path: Path) {
        this.path = path;
    }
}

export abstract class FileStorage {
    protected basePath: Path;
    
    protected constructor(basePath: string) {
        this.basePath = basePath;
    }

    public abstract save(path: Path, file: Express.Multer.File): Promise<SavedFile>;
    public abstract delete(path: Path): Promise<void>;
    public abstract get(path: Path): Promise<ReadStream>;
}
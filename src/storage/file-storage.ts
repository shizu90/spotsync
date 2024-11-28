import * as path from "path";

export type Path = string;

export const FileStorageProvider = "FileStorage";

export abstract class FileStorage {
    protected basePath: Path;
    
    protected constructor() {
        this.basePath = path.join(__dirname, "../../files");
    }

    public abstract save(path: Path, file: Express.Multer.File): Promise<Path>;
    public abstract delete(path: Path): Promise<void>;
    public abstract get(path: Path): Promise<Buffer>;
}
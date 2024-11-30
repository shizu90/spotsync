import * as fs from "fs";
import * as path from "path";
import { FileStorage, SavedFile } from "./file-storage";

export class LocalFileStorage extends FileStorage {
    public constructor() {
        super();
    }

    public async save(file_path: string, file: Express.Multer.File): Promise<SavedFile> {
        try {
            const dir = path.dirname(
                path.join(this.basePath, file_path, file.originalname)
            );
            
            await fs.promises.mkdir(dir, { recursive: true });

            const fileToStore = path.join(this.basePath, file_path, file.originalname);

            await fs.promises.writeFile(fileToStore, file.buffer);

            const base64 = file.buffer.toString("base64");

            const contents = "data:" + file.mimetype + ";base64," + base64;

            const savedFile = new SavedFile(fileToStore, contents);

            return savedFile;
        } catch (error) {
            console.error("Error saving file", error);
            throw new Error("Error saving file");
        }
    }

    public async delete(file_path: string): Promise<void> {
        try {
            const full_path = path.join(this.basePath, file_path);

            await fs.promises.unlink(full_path);
        } catch(error) {
            console.error("Error deleting file", error);
            throw new Error("Error deleting file");
        }
    }

    public async get(file_path: string): Promise<Buffer> {
        try {
            const full_path = path.join(this.basePath, file_path);

            return await fs.promises.readFile(full_path);
        } catch (error) {
            console.error("Error getting file", error);
            throw new Error("Error getting file");
        }
    }
}
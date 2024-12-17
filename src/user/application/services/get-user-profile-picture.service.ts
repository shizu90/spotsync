import { Inject, Injectable } from "@nestjs/common";
import { ReadStream } from "fs";
import { FileStorage, FileStorageProvider } from "src/storage/file-storage";
import { GetUserProfilePictureCommand } from "../ports/in/commands/get-user-profile-picture.command";
import { GetUserProfilePictureUseCase } from "../ports/in/use-cases/get-user-profile-picture.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";
import { UserNotFoundError } from "./errors/user-not-found.error";

@Injectable()
export class GetUserProfilePictureService implements GetUserProfilePictureUseCase {
    constructor(
        @Inject(FileStorageProvider)
        protected fileStorage: FileStorage,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
    ) {}

    public async execute(command: GetUserProfilePictureCommand): Promise<ReadStream> {
        const user = await this.userRepository.findById(command.id);

        if (!user) {
            throw new UserNotFoundError();
        }

        return this.fileStorage.get(user.profile().profilePicture());
    }
}
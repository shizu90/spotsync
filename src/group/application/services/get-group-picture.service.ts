import { Inject, Injectable } from "@nestjs/common";
import { ReadStream } from "fs";
import { FileStorage, FileStorageProvider } from "src/storage/file-storage";
import { GetGroupPictureCommand } from "../ports/in/commands/get-group-picture.command";
import { GetGroupPictureUseCase } from "../ports/in/use-cases/get-group-picture.use-case";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupNotFoundError } from "./errors/group-not-found.error";

@Injectable()
export class GetGroupPictureService implements GetGroupPictureUseCase {
    constructor(
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(FileStorageProvider)
        protected fileStorage: FileStorage,
    ) {}

    public async execute(command: GetGroupPictureCommand): Promise<ReadStream> {
        const group = await this.groupRepository.findById(command.id);

        if (!group) {
            throw new GroupNotFoundError();
        }

        return this.fileStorage.get(group.groupPicture());
    }
}
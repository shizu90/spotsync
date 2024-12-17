import { Inject, Injectable } from "@nestjs/common";
import { ReadStream } from "fs";
import { FileStorage, FileStorageProvider } from "src/storage/file-storage";
import { GetGroupBannerPictureCommand } from "../ports/in/commands/get-group-banner-picture.command";
import { GetGroupBannerPictureUseCase } from "../ports/in/use-cases/get-group-banner-picture.use-case";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupNotFoundError } from "./errors/group-not-found.error";

@Injectable()
export class GetGroupBannerPictureService implements GetGroupBannerPictureUseCase {
    constructor(
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(FileStorageProvider)
        protected fileStorage: FileStorage,
    ) {}

    public async execute(command: GetGroupBannerPictureCommand): Promise<ReadStream> {
        const group = await this.groupRepository.findById(command.id);

        if (!group) {
            throw new GroupNotFoundError();
        }

        return this.fileStorage.get(group.bannerPicture());
    }
}
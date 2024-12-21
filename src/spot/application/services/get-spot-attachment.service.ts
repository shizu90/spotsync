import { Inject, Injectable } from "@nestjs/common";
import { ReadStream } from "fs";
import { FileStorage, FileStorageProvider } from "src/storage/file-storage";
import { GetSpotAttachmentCommand } from "../ports/in/commands/get-spot-attachment.command";
import { GetSpotAttachmentUseCase } from "../ports/in/use-cases/get-spot-attachment.use-case";
import { SpotRepository, SpotRepositoryProvider } from "../ports/out/spot.repository";
import { SpotAttachmentNotFoundError } from "./errors/spot-attachment-not-found.error";
import { SpotNotFoundError } from "./errors/spot-not-found.error";

@Injectable()
export class GetSpotAttachmentService implements GetSpotAttachmentUseCase {
    constructor(
        @Inject(SpotRepositoryProvider)
        protected spotRepository: SpotRepository,
        @Inject(FileStorageProvider)
        protected fileStorage: FileStorage,
    ) {}

    public async execute(command: GetSpotAttachmentCommand): Promise<ReadStream> {
        const spot = await this.spotRepository.findById(command.id);

        if (!spot) {
            throw new SpotNotFoundError();
        }

        const attachment = spot.findAttachment(command.attachmentId);

        if (!attachment) {
            throw new SpotAttachmentNotFoundError();
        }

        return await this.fileStorage.get(attachment.filePath());
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { ReadStream } from "fs";
import { FileStorage, FileStorageProvider } from "src/storage/file-storage";
import { GetAttachmentCommand } from "../ports/in/commands/get-attachment.command";
import { GetAttachmentUseCase } from "../ports/in/use-cases/get-attachment.use-case";
import { PostRepository, PostRepositoryProvider } from "../ports/out/post.repository";
import { PostAttachmentNotFoundError } from "./errors/post-attachment-not-found.error";
import { PostNotFoundError } from "./errors/post-not-found.error";

@Injectable()
export class GetAttachmentService implements GetAttachmentUseCase {
    public constructor(
        @Inject(PostRepositoryProvider)
        protected postRepository: PostRepository,
        @Inject(FileStorageProvider)
        protected fileStorage: FileStorage,
    ) {}

    public async execute(command: GetAttachmentCommand): Promise<ReadStream> {
        const post = await this.postRepository.findById(command.postId);

        if (!post) {
            throw new PostNotFoundError();
        }

        const attachment = post.findAttachment(command.attachmentId);

        if (!attachment) {
            throw new PostAttachmentNotFoundError();
        }

        return this.fileStorage.get(attachment.filePath());
    }
}
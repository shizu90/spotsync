import { Inject, Injectable } from "@nestjs/common";
import { ReadStream } from "fs";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FileStorage, FileStorageProvider } from "src/storage/file-storage";
import { GetAttachmentCommand } from "../ports/in/commands/get-attachment.command";
import { GetAttachmentUseCase } from "../ports/in/use-cases/get-attachment.use-case";
import { PostRepository, PostRepositoryProvider } from "../ports/out/post.repository";
import { PostAttachmentNotFoundError } from "./errors/post-attachment-not-found.error";
import { PostNotFoundError } from "./errors/post-not-found.error";

@Injectable()
export class GetAttachmentService implements GetAttachmentUseCase {
    public constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
        @Inject(PostRepositoryProvider)
        protected postRepository: PostRepository,
        @Inject(FileStorageProvider)
        protected fileStorage: FileStorage,
    ) {}

    public async execute(command: GetAttachmentCommand): Promise<ReadStream> {
        const user = await this.getAuthenticatedUserUseCase.execute(null);

        const post = await this.postRepository.findAuthorizedPostById(user.id(), command.postId);

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
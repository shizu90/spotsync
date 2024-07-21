import { Inject, Injectable } from "@nestjs/common";
import { CreatePostUseCase } from "../ports/in/use-cases/create-post.use-case";
import { PostRepository, PostRepositoryProvider } from "../ports/out/post.repository";
import { CreatePostCommand } from "../ports/in/commands/create-post.command";
import { CreatePostDto } from "../ports/out/dto/create-post.dto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupRepository, GroupRepositoryProvider } from "src/group/application/ports/out/group.repository";
import { GroupNotFoundError } from "src/group/application/services/errors/group-not-found.error";
import { Post } from "src/post/domain/post.model";
import { randomUUID } from "crypto";
import { PostNotFoundError } from "./errors/post-not-found.error";
import { Group } from "src/group/domain/group.model";
import { PostThreadRepository, PostThreadRepositoryProvider } from "../ports/out/post-thread.repository";

@Injectable()
export class CreatePostService implements CreatePostUseCase 
{
    constructor(
        @Inject(PostRepositoryProvider)
        protected postRepository: PostRepository,
        @Inject(PostThreadRepositoryProvider)
        protected postThreadRepository: PostThreadRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository
    ) 
    {}

    public async execute(command: CreatePostCommand): Promise<CreatePostDto> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const user = await this.userRepository.findById(command.userId);

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        if(user.id() !== authenticatedUserId) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        let parent: Post = null;

        if(command.parentId !== null && command.parentId !== undefined) {
            const post = await this.postRepository.findById(command.parentId);

            if(post === null || post === undefined) {
                throw new PostNotFoundError(`Parent post not found`);
            }

            parent = post;
        }

        let group: Group = null;

        if(command.groupId !== null && command.groupId !== undefined) {
            const g = await this.groupRepository.findById(command.groupId);

            if(g === null || g === undefined || g.isDeleted()) {
                throw new GroupNotFoundError(`Group not found`);
            }

            group = g;
        }

        const post = Post.create(
            randomUUID(),
            command.title,
            command.content,
            command.visibility,
            user,
            [],
            parent,
            group,
        );

        if(post.thread().maxDepthLevel() === 0) {
            await this.postThreadRepository.store(post.thread());
        }
        this.postRepository.store(post);

        return new CreatePostDto(
            post.id(),
            post.title(),
            post.content(),
            post.visibility(),
            [],
            post.thread().id(),
            post.depthLevel(),
            post.parent() ? post.parent().id() : null,
            post.creator().id(),
            post.group() ? post.group().id() : null
        );
    }
}
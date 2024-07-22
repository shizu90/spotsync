import { Inject, Injectable } from "@nestjs/common";
import { DeletePostUseCase } from "../ports/in/use-cases/delete-post.use-case";
import { PostRepository, PostRepositoryProvider } from "../ports/out/post.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { DeletePostCommand } from "../ports/in/commands/delete-post.command";
import { PostNotFoundError } from "./errors/post-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { PostThreadRepository, PostThreadRepositoryProvider } from "../ports/out/post-thread.repository";
import { PermissionName } from "src/group/domain/permission-name.enum";

@Injectable()
export class DeletePostService implements DeletePostUseCase 
{
    constructor(
        @Inject(PostRepositoryProvider)
        protected postRepository: PostRepository,
        @Inject(PostThreadRepositoryProvider)
        protected postThreadRepository: PostThreadRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository
    ) 
    {}

    public async execute(command: DeletePostCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const post = await this.postRepository.findById(command.id);

        if(post === null || post === undefined) {
            throw new PostNotFoundError(`Post not found`);
        }

        let canDelete = post.creator().id() === authenticatedUserId;

        if(post.group() !== null) {
            const authenticatedGroupMember = (await this.groupMemberRepository.findBy({groupId: post.group().id(), userId: authenticatedUserId})).at(0);

            if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
                throw new UnauthorizedAccessError(`User is not a member of the group`);
            }
            
            canDelete = canDelete || authenticatedGroupMember.canExecute(PermissionName.DELETE_POSTS);
        }

        if(!canDelete) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        await this.postRepository.delete(post.id());

        if(post.depthLevel() === 0) {
            this.postThreadRepository.delete(post.thread().id());
        }
    }
}
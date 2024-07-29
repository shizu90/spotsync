import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { PostVisibility } from "src/post/domain/post-visibility.enum";
import { Post } from "src/post/domain/post.model";
import { GetPostCommand } from "../ports/in/commands/get-post.command";
import { GetPostUseCase } from "../ports/in/use-cases/get-post.use-case";
import { GetPostDto } from "../ports/out/dto/get-post.dto";
import { PostRepository, PostRepositoryProvider } from "../ports/out/post.repository";

@Injectable()
export class GetPostService implements GetPostUseCase
{
    constructor(
        @Inject(PostRepositoryProvider)
        protected postRepository: PostRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository
    ) 
    {}

    public async execute(command: GetPostCommand): Promise<GetPostDto> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const post = await this.postRepository.findById(command.id);

        switch(post.visibility()) {
            case PostVisibility.PRIVATE:
                if (post.group() !== null && post.group() !== undefined) {
                    const authenticatedGroupMember = (await this.groupMemberRepository.findBy({
                        groupId: post.group().id(),
                        userId: authenticatedUser.id()
                    })).at(0);

                    if (authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
                        throw new UnauthorizedAccessError(`Unauthorized access`);
                    }
                }else if(post.creator().id() !== authenticatedUser.id()) {
                    throw  new UnauthorizedAccessError(`Unauthorized access`);
                } 

                break;
            case PostVisibility.FOLLOWERS:
                const follow = (await this.followRepository.findBy({
                    fromUserId: authenticatedUser.id(),
                    toUserId: post.creator().id()
                })).at(0);

                if (follow === null || follow === undefined) {
                    throw new UnauthorizedAccessError(`Unauthorized access`);
                }

                break;
            case PostVisibility.PUBLIC:
            default:
                break;
        }

        const toGetPostDto = (post: Post) => {
            return new GetPostDto(
                post.id(),
                post.title(),
                post.content(),
                post.attachments().map((a) => {return {id: a.id(), file_path: a.filePath(), file_type: a.fileType()};}),
                {
                    id: post.creator().id(),
                    banner_picture: post.creator().bannerPicture(),
                    profile_picture: post.creator().profilePicture(),
                    credentials: {name: post.creator().credentials().name()},
                    first_name: post.creator().firstName(),
                    last_name: post.creator().lastName(),
                    profile_theme_color: post.creator().profileThemeColor()
                },
                post.visibility(),
                post.depthLevel(),
                post.thread().id(),
                post.createdAt(),
                post.updatedAt(),
                post.parent() ? post.parent().id() : null,
                post.group() ? post.group().id() : null,
                (command.maxDepthLevel ? 
                    post.childrens().some((children_post) => children_post.depthLevel() <= command.maxDepthLevel) ? 
                        post.childrens().map((p) => {
                            return toGetPostDto(p);
                        })
                    : []
                :
                    post.childrens().map((p) => {
                        return toGetPostDto(p);
                    })
                ),
                post.childrens().length
            );
        };

        return toGetPostDto(post);
    }
}
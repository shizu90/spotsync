import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { Pagination } from "src/common/common.repository";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "src/group/application/ports/out/group.repository";
import { GroupNotFoundError } from "src/group/application/services/errors/group-not-found.error";
import { GroupVisibility } from "src/group/domain/group-visibility.enum";
import { PostVisibility } from "src/post/domain/post-visibility.enum";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { ListThreadsCommand } from "../ports/in/commands/list-threads.command";
import { ListThreadsUseCase } from "../ports/in/use-cases/list-threads.use-case";
import { GetPostDto } from "../ports/out/dto/get-post.dto";
import { PostRepository, PostRepositoryProvider } from "../ports/out/post.repository";

@Injectable()
export class ListThreadsService implements ListThreadsUseCase 
{
    constructor(
        @Inject(PostRepositoryProvider)
        protected postRepository: PostRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository,
    ) 
    {}

    public async execute(command: ListThreadsCommand): Promise<Pagination<GetPostDto>> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        let visibilitiesToFilter = [PostVisibility.PUBLIC];

        if (command.groupId !== null && command.groupId !== undefined) {
            const group = await this.groupRepository.findById(command.groupId);

            if (group === null || group === undefined || group.isDeleted()) {
                throw new GroupNotFoundError(`Group not found`);
            }

            switch(group.visibilityConfiguration().postVisibility()) {
                case GroupVisibility.PRIVATE:
                    const groupMember = await this.groupMemberRepository.findBy({
                        groupId: group.id(),
                        userId: authenticatedUser.id()
                    });

                    if (groupMember === null || groupMember === undefined) {
                        throw new UnauthorizedAccessError(`Unauthorized access`);
                    }

                    visibilitiesToFilter = [PostVisibility.PRIVATE];

                    break;
                case GroupVisibility.PUBLIC:
                default:
                    break;
            }
        }

        if ((command.userId !== null && command.userId !== undefined) && (command.groupId === null || command.groupId === undefined)) {
            const user = await this.userRepository.findById(command.userId);

            if (user === null || user === undefined || user.isDeleted()) {
                throw new UserNotFoundError(`User not found`);
            }

            switch(user.visibilityConfiguration().postVisibility()) {
                case UserVisibility.FOLLOWERS:
                    const follow = (await this.followRepository.findBy({
                        fromUserId: authenticatedUser.id(),
                        toUserId: user.id()
                    })).at(0);

                    if (follow === null || follow === undefined) {
                        throw new UnauthorizedAccessError(`Unauthorized access`);
                    }

                    visibilitiesToFilter = [PostVisibility.PUBLIC, PostVisibility.FOLLOWERS];

                    break;
                case UserVisibility.PRIVATE:
                case UserVisibility.PUBLIC:
                    break;
            }
        }

        const pagination = await this.postRepository.paginate({
            filters: {
                groupId: command.groupId,
                visibility: visibilitiesToFilter,
                userId: command.userId,
                depthLevel: 0
            },
            sort: command.sort,
            sortDirection: command.sortDirection,
            paginate: command.paginate,
            page: command.page,
            limit: command.limit
        });

        const items = pagination.items.map((i) => {
            return new GetPostDto(
                i.id(),
                i.title(),
                i.content(),
                i.attachments().map((i) => {return {id: i.id(), file_path: i.filePath(), file_type: i.fileType()};}),
                {
                    id: i.creator().id(),
                    first_name: i.creator().firstName(),
                    last_name: i.creator().lastName(),
                    profile_picture: i.creator().profilePicture(),
                    banner_picture: i.creator().bannerPicture(),
                    profile_theme_color: i.creator().profileThemeColor(),
                    credentials: {name: i.creator().credentials().name()}
                },
                i.visibility(),
                i.depthLevel(),
                i.thread().id(),
                i.createdAt(),
                i.updatedAt(),
                i.parent() ? i.parent().id() : null,
                i.group() ? i.group().id() : null,
                [],
                i.childrens().length
            );
        });

        return new Pagination(items, pagination.total, pagination.current_page);
    }
}
import { Inject, Injectable } from '@nestjs/common';
import { ListGroupsUseCase } from '../ports/in/use-cases/list-groups.use-case';
import { ListGroupsCommand } from '../ports/in/commands/list-groups.command';
import { GetGroupDto } from '../ports/out/dto/get-group.dto';
import {
  GetAuthenticatedUserUseCase,
  GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
  GroupRepository,
  GroupRepositoryProvider,
} from '../ports/out/group.repository';
import {
  GroupMemberRepository,
  GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import { Pagination } from 'src/common/common.repository';

@Injectable()
export class ListGroupsService implements ListGroupsUseCase {
  constructor(
    @Inject(GetAuthenticatedUserUseCaseProvider)
    protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    @Inject(GroupRepositoryProvider)
    protected groupRepository: GroupRepository,
    @Inject(GroupMemberRepositoryProvider)
    protected groupMemberRepository: GroupMemberRepository,
  ) {}

  public async execute(
    command: ListGroupsCommand,
  ): Promise<Pagination<GetGroupDto>> {
    const authenticatedUserId = this.getAuthenticatedUser.execute(null);

    const pagination = await this.groupRepository.paginate({
      filters: {
        name: command.name,
        groupVisibility: command.groupVisibility,
      },
      sort: command.sort,
      sortDirection: command.sortDirection,
      page: command.page,
      paginate: command.paginate,
      limit: command.limit,
    });

    const items = await Promise.all(
      pagination.items.map(async (g) => {
        if (g === null || g === undefined) return null;

        const groupMember = (
          await this.groupMemberRepository.findBy({
            groupId: g.id(),
            userId: authenticatedUserId,
          })
        ).at(0);

        return new GetGroupDto(
          g.id(),
          g.name(),
          g.about(),
          g.groupPicture(),
          g.bannerPicture(),
          {
            group_visibility: g.visibilityConfiguration().groupVisibility(),
            post_visibility: g.visibilityConfiguration().postVisibility(),
            event_visibility: g.visibilityConfiguration().eventVisibility(),
          },
          g.createdAt(),
          g.updatedAt(),
          groupMember ? true : false,
          groupMember
            ? {
                id: groupMember.id(),
                user_id: groupMember.user().id(),
                is_creator: groupMember.isCreator(),
                joined_at: groupMember.joinedAt(),
                role: {
                  id: groupMember.role().id(),
                  name: groupMember.role().name(),
                  permissions: groupMember
                    .role()
                    .permissions()
                    .map((p) => {
                      return { id: p.id(), name: p.name() };
                    }),
                },
              }
            : null,
        );
      }),
    );

    return new Pagination(items, pagination.total, pagination.current_page);
  }
}

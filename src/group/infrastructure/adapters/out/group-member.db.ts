import { Inject, Injectable } from '@nestjs/common';
import { PaginateParameters, Pagination } from 'src/common/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupMemberRepository } from 'src/group/application/ports/out/group-member.repository';
import { GroupMemberRequest } from 'src/group/domain/group-member-request.model';
import { GroupMember } from 'src/group/domain/group-member.model';
import { GroupPermission } from 'src/group/domain/group-permission.model';
import { GroupRole } from 'src/group/domain/group-role.model';
import { GroupVisibilityConfig } from 'src/group/domain/group-visibility-config.model';
import { Group } from 'src/group/domain/group.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { User } from 'src/user/domain/user.model';

@Injectable()
export class GroupMemberRepositoryImpl implements GroupMemberRepository {
  constructor(
    @Inject(PrismaService)
    protected prismaService: PrismaService,
  ) {}

  private mapGroupMemberToDomain(prisma_model: any): GroupMember {
    if (prisma_model === null || prisma_model === undefined) return null;

    return GroupMember.create(
      prisma_model.id,
      Group.create(
        prisma_model.group.id,
        prisma_model.group.name,
        prisma_model.group.about,
        prisma_model.group.group_picture,
        prisma_model.group.banner_picture,
        GroupVisibilityConfig.create(
          prisma_model.group.id,
          prisma_model.group.visibility_configuration.post_visibility,
          prisma_model.group.visibility_configuration.event_visibility,
          prisma_model.group.visibility_configuration.group_visibility,
        ),
        prisma_model.group.created_at,
        prisma_model.group.updated_at,
        prisma_model.group.is_deleted,
      ),
      User.create(
        prisma_model.user.id,
        prisma_model.user.profile_picture,
        prisma_model.user.banner_picture,
        prisma_model.user.biograph,
        prisma_model.user.birth_date,
        UserCredentials.create(
          prisma_model.user.id,
          prisma_model.user.credentials.name,
          prisma_model.user.credentials.email,
          prisma_model.user.credentials.password,
          prisma_model.user.credentials.last_login,
          prisma_model.user.credentials.last_logout,
        ),
        UserVisibilityConfig.create(
          prisma_model.user.id,
          prisma_model.user.visibility_configuration.profile_visibility,
          prisma_model.user.visibility_configuration.address_visibility,
          prisma_model.user.visibility_configuration.poi_folder_visibility,
          prisma_model.user.visibility_configuration.visited_poi_visibility,
          prisma_model.user.visibility_configuration.post_visibility,
        ),
        prisma_model.user.created_at,
        prisma_model.user.updated_at,
        prisma_model.user.is_deleted,
      ),
      GroupRole.create(
        prisma_model.group_role.id,
        prisma_model.group_role.name,
        prisma_model.group_role.hex_color,
        prisma_model.group_role.permissions.map((p) => {
          return GroupPermission.create(
            p.group_permission.id,
            p.group_permission.name,
          );
        }),
        prisma_model.group_role.is_immutable,
      ),
      prisma_model.is_creator,
      prisma_model.joined_at,
    );
  }

  private mapGroupMemberRequestToDomain(prisma_model: any): GroupMemberRequest {
    if (prisma_model === null || prisma_model === undefined) return null;

    return GroupMemberRequest.create(
      prisma_model.id,
      Group.create(
        prisma_model.group.id,
        prisma_model.group.name,
        prisma_model.group.about,
        prisma_model.group.group_picture,
        prisma_model.group.banner_picture,
        GroupVisibilityConfig.create(
          prisma_model.group.id,
          prisma_model.group.visibility_configuration.post_visibility,
          prisma_model.group.visibility_configuration.event_visibility,
          prisma_model.group.visibility_configuration.group_visibility,
        ),
        prisma_model.group.created_at,
        prisma_model.group.updated_at,
        prisma_model.group.is_deleted,
      ),
      User.create(
        prisma_model.user.id,
        prisma_model.user.profile_picture,
        prisma_model.user.banner_picture,
        prisma_model.user.biograph,
        prisma_model.user.birth_date,
        UserCredentials.create(
          prisma_model.user.id,
          prisma_model.user.credentials.name,
          prisma_model.user.credentials.email,
          prisma_model.user.credentials.password,
          prisma_model.user.credentials.last_login,
          prisma_model.user.credentials.last_logout,
        ),
        UserVisibilityConfig.create(
          prisma_model.user.id,
          prisma_model.user.visibility_configuration.profile_visibility,
          prisma_model.user.visibility_configuration.address_visibility,
          prisma_model.user.visibility_configuration.poi_folder_visibility,
          prisma_model.user.visibility_configuration.visited_poi_visibility,
          prisma_model.user.visibility_configuration.post_visibility,
        ),
        prisma_model.user.created_at,
        prisma_model.user.updated_at,
        prisma_model.user.is_deleted,
      ),
      prisma_model.requested_on,
    );
  }

  public async paginate(
    params: PaginateParameters,
  ): Promise<Pagination<GroupMember>> {
    let query = `SELECT group_members.id FROM group_members JOIN users ON users.id = group_members.user_id JOIN user_credentials ON user_credentials.user_id = users.id WHERE users.is_deleted = false`;

    if (params.filters) {
      if (typeof params.filters['name'] === 'string') {
        const name = params.filters['name'];
        if (query.includes('WHERE')) {
          query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
        } else {
          query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
        }
      }

      if (typeof params.filters['roleId'] === 'string') {
        const roleId = params.filters['roleId'];
        if (query.includes('WHERE')) {
          query = `${query} AND group_members.role_id = '${roleId}'`;
        } else {
          query = `${query} WHERE group_members.role_id = '${roleId}'`;
        }
      }

      if (typeof params.filters['groupId'] === 'string') {
        const groupId = params.filters['groupId'];
        if (query.includes('WHERE')) {
          query = `${query} AND group_members.group_id = '${groupId}'`;
        } else {
          query = `${query} WHERE group_members.group_id = '${groupId}'`;
        }
      }
    }

    const ids =
      await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

    const sort = params.sort ?? 'name';
    const sortDirection = params.sortDirection ?? SortDirection.ASC;

    let orderBy = {};

    switch (sort) {
      case 'name':
        orderBy = { user: { credentials: { name: sortDirection } } };
        break;
      case 'joined_at':
      case 'joinedAt':
      default:
        orderBy = { joined_at: sortDirection };
        break;
    }

    let items = [];

    const paginate = params.paginate ?? false;
    const page = params.page ?? 0;
    const limit = params.limit ?? 12;
    const total = ids.length;

    if (paginate) {
      items = await this.prismaService.groupMember.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        orderBy: orderBy,
        include: {
          user: {
            include: {
              credentials: true,
              visibility_configuration: true,
            },
          },
          group_role: {
            include: {
              permissions: {
                include: {
                  group_permission: true,
                },
              },
            },
          },
          group: {
            include: {
              visibility_configuration: true,
            },
          },
        },
        skip: page * limit,
        take: limit,
      });
    } else {
      items = await this.prismaService.groupMember.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        orderBy: orderBy,
        include: {
          user: {
            include: {
              credentials: true,
              visibility_configuration: true,
            },
          },
          group_role: {
            include: {
              permissions: {
                include: {
                  group_permission: true,
                },
              },
            },
          },
          group: {
            include: {
              visibility_configuration: true,
            },
          },
        },
      });
    }

    items = items.map((i) => {
      return this.mapGroupMemberToDomain(i);
    });

    return new Pagination(items, total, page);
  }

  public async paginateRequest(
    params: PaginateParameters,
  ): Promise<Pagination<GroupMemberRequest>> {
    let query = `SELECT group_member_requests.id FROM group_member_requests JOIN users ON users.id = group_member_requests.user_id JOIN user_credentials ON user_credentials.user_id = users.id WHERE users.is_deleted = false`;

    if (params.filters) {
      if (typeof params.filters['name'] === 'string') {
        const name = params.filters['name'];
        if (query.includes('WHERE')) {
          query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
        } else {
          query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
        }
      }

      if (typeof params.filters['roleId'] === 'string') {
        const roleId = params.filters['roleId'];
        if (query.includes('WHERE')) {
          query = `${query} AND group_members.role_id = '${roleId}'`;
        } else {
          query = `${query} WHERE group_members.role_id = '${roleId}'`;
        }
      }

      if (typeof params.filters['groupId'] === 'string') {
        const groupId = params.filters['groupId'];
        if (query.includes('WHERE')) {
          query = `${query} AND group_members.group_id = '${groupId}'`;
        } else {
          query = `${query} WHERE group_members.group_id = '${groupId}'`;
        }
      }
    }

    const ids =
      await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

    const sort = params.sort ?? 'name';
    const sortDirection = params.sortDirection ?? SortDirection.ASC;

    let orderBy = {};

    switch (sort) {
      case 'name':
      default:
        orderBy = { user: { credentials: { name: sortDirection } } };
        break;
    }

    let items = [];

    const paginate = params.paginate ?? false;
    const page = params.page ?? 0;
    const limit = params.limit ?? 12;
    const total = ids.length;

    if (paginate) {
      items = await this.prismaService.groupMemberRequest.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        orderBy: orderBy,
        skip: limit * page,
        take: limit,
        include: {
          user: {
            include: { credentials: true, visibility_configuration: true },
          },
          group: {
            include: { visibility_configuration: true },
          },
        },
      });
    } else {
      items = await this.prismaService.groupMemberRequest.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        orderBy: orderBy,
        include: {
          user: {
            include: { credentials: true, visibility_configuration: true },
          },
          group: {
            include: { visibility_configuration: true },
          },
        },
      });
    }

    items = items.map((i) => {
      return this.mapGroupMemberRequestToDomain(i);
    });

    return new Pagination(items, total, page);
  }

  public async findBy(values: Object): Promise<Array<GroupMember>> {
    const name = values['name'];
    const roleId = values['roleId'];
    const groupId = values['groupId'];
    const userId = values['userId'];

    let query =
      'SELECT group_members.id FROM group_members JOIN users ON users.id = group_members.user_id JOIN user_credentials ON user_credentials.user_id = users.id WHERE users.is_deleted = false';

    if (name) {
      if (query.includes('WHERE')) {
        query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
      } else {
        query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
      }
    }

    if (roleId) {
      if (query.includes('WHERE')) {
        query = `${query} AND group_members.role_id = '${roleId}'`;
      } else {
        query = `${query} WHERE group_members.role_id = '${roleId}'`;
      }
    }

    if (groupId) {
      if (query.includes('WHERE')) {
        query = `${query} AND group_members.group_id = '${groupId}'`;
      } else {
        query = `${query} WHERE group_members.group_id = '${groupId}'`;
      }
    }

    if (userId) {
      if (query.includes('WHERE')) {
        query = `${query} AND group_members.user_id = '${userId}'`;
      } else {
        query = `${query} WHERE group_members.user_id = '${userId}'`;
      }
    }

    const groupMemberIds =
      await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

    const groupMembers = await this.prismaService.groupMember.findMany({
      where: { id: { in: groupMemberIds.map((row) => row.id) } },
      include: {
        user: {
          include: {
            credentials: true,
            visibility_configuration: true,
          },
        },
        group_role: {
          include: {
            permissions: {
              include: {
                group_permission: true,
              },
            },
          },
        },
        group: {
          include: {
            visibility_configuration: true,
          },
        },
      },
    });

    return groupMembers.map((gm) => {
      return this.mapGroupMemberToDomain(gm);
    });
  }

  public async findAll(): Promise<Array<GroupMember>> {
    const groupMembers = await this.prismaService.groupMember.findMany({
      include: {
        user: {
          include: {
            credentials: true,
            visibility_configuration: true,
          },
        },
        group_role: {
          include: {
            permissions: {
              include: {
                group_permission: true,
              },
            },
          },
        },
        group: {
          include: {
            visibility_configuration: true,
          },
        },
      },
    });

    return groupMembers.map((gm) => {
      return this.mapGroupMemberToDomain(gm);
    });
  }

  public async findById(id: string): Promise<GroupMember> {
    const groupMember = await this.prismaService.groupMember.findFirst({
      where: { id: id },
      include: {
        user: {
          include: {
            credentials: true,
            visibility_configuration: true,
          },
        },
        group_role: {
          include: {
            permissions: {
              include: {
                group_permission: true,
              },
            },
          },
        },
        group: {
          include: {
            visibility_configuration: true,
          },
        },
      },
    });

    return this.mapGroupMemberToDomain(groupMember);
  }

  public async findRequestBy(
    values: Object,
  ): Promise<Array<GroupMemberRequest>> {
    const name = values['name'];
    const groupId = values['groupId'];
    const userId = values['userId'];

    const sort = String(values['sort'] ?? 'name').toLowerCase();
    const sortDirection = String(
      values['sortDirection'] ?? 'asc',
    ).toLowerCase();
    const paginate = values['paginate'] ?? false;
    const page = values['page'] ?? 0;
    const limit = values['limit'] ?? 12;

    let query =
      'SELECT group_member_requests.id FROM group_member_requests JOIN users ON users.id = group_member_requests.user_id JOIN user_credentials ON user_credentials.user_id = users.id WHERE users.is_deleted = false';

    if (name) {
      if (query.includes('WHERE')) {
        query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
      } else {
        query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
      }
    }

    if (groupId) {
      if (query.includes('WHERE')) {
        query = `${query} AND group_member_requests.group_id = '${groupId}'`;
      } else {
        query = `${query} WHERE group_member_requests.group_id = '${groupId}'`;
      }
    }

    if (userId) {
      if (query.includes('WHERE')) {
        query = `${query} AND group_member_requests.user_id = '${userId}'`;
      } else {
        query = `${query} WHERE group_member_requests.user_id = '${userId}'`;
      }
    }

    const groupMemberRequestIds =
      await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

    let orderBy = {};

    switch (sort) {
      case 'name':
        orderBy = {
          user: {
            credentials: {
              name: sortDirection,
            },
          },
        };

        break;
      case 'id':
      default:
        orderBy = {
          id: sortDirection,
        };

        break;
    }

    let groupMemberRequests = [];

    if (paginate) {
      groupMemberRequests =
        await this.prismaService.groupMemberRequest.findMany({
          where: { id: { in: groupMemberRequestIds.map((row) => row.id) } },
          orderBy: orderBy,
          skip: limit * page,
          take: limit,
          include: {
            user: {
              include: { credentials: true, visibility_configuration: true },
            },
            group: {
              include: { visibility_configuration: true },
            },
          },
        });
    } else {
      groupMemberRequests =
        await this.prismaService.groupMemberRequest.findMany({
          where: { id: { in: groupMemberRequestIds.map((row) => row.id) } },
          orderBy: orderBy,
          include: {
            user: {
              include: { credentials: true, visibility_configuration: true },
            },
            group: {
              include: { visibility_configuration: true },
            },
          },
        });
    }

    return groupMemberRequests.map((groupMemberRequest) => {
      return this.mapGroupMemberRequestToDomain(groupMemberRequest);
    });
  }

  public async findRequestById(id: string): Promise<GroupMemberRequest> {
    const groupMemberRequest =
      await this.prismaService.groupMemberRequest.findFirst({
        where: { id: id },
        include: {
          group: {
            include: {
              visibility_configuration: true,
            },
          },
          user: {
            include: {
              credentials: true,
              visibility_configuration: true,
            },
          },
        },
      });

    return this.mapGroupMemberRequestToDomain(groupMemberRequest);
  }

  public async findRequestByGroupIdAndUserId(
    groupId: string,
    userId: string,
  ): Promise<GroupMemberRequest> {
    const groupMemberRequest =
      await this.prismaService.groupMemberRequest.findFirst({
        where: { group_id: groupId, user_id: userId },
        include: {
          group: {
            include: {
              visibility_configuration: true,
            },
          },
          user: {
            include: {
              credentials: true,
              visibility_configuration: true,
            },
          },
        },
      });

    return this.mapGroupMemberRequestToDomain(groupMemberRequest);
  }

  public async store(model: GroupMember): Promise<GroupMember> {
    const groupMember = await this.prismaService.groupMember.create({
      data: {
        group_id: model.group().id(),
        user_id: model.user().id(),
        is_creator: model.isCreator(),
        group_role_id: model.role().id(),
        id: model.id(),
        joined_at: model.joinedAt(),
      },
      include: {
        user: {
          include: {
            credentials: true,
            visibility_configuration: true,
          },
        },
        group_role: {
          include: {
            permissions: {
              include: {
                group_permission: true,
              },
            },
          },
        },
        group: {
          include: {
            visibility_configuration: true,
          },
        },
      },
    });

    return this.mapGroupMemberToDomain(groupMember);
  }

  public async storeRequest(
    model: GroupMemberRequest,
  ): Promise<GroupMemberRequest> {
    const groupMemberRequest =
      await this.prismaService.groupMemberRequest.create({
        data: {
          id: model.id(),
          group_id: model.group().id(),
          user_id: model.user().id(),
          requested_on: model.requestedOn(),
        },
        include: {
          group: {
            include: {
              visibility_configuration: true,
            },
          },
          user: {
            include: {
              credentials: true,
              visibility_configuration: true,
            },
          },
        },
      });

    return this.mapGroupMemberRequestToDomain(groupMemberRequest);
  }

  public async update(model: GroupMember): Promise<GroupMember> {
    const groupMember = await this.prismaService.groupMember.update({
      data: {
        group_role_id: model.role().id(),
      },
      where: { id: model.id() },
      include: {
        user: {
          include: {
            credentials: true,
            visibility_configuration: true,
          },
        },
        group_role: {
          include: {
            permissions: {
              include: {
                group_permission: true,
              },
            },
          },
        },
        group: {
          include: {
            visibility_configuration: true,
          },
        },
      },
    });

    return this.mapGroupMemberToDomain(groupMember);
  }

  public async delete(id: string): Promise<void> {
    await this.prismaService.groupMember.delete({
      where: { id: id },
    });
  }

  public async deleteRequest(id: string): Promise<void> {
    await this.prismaService.groupMemberRequest.delete({
      where: { id: id },
    });
  }
}

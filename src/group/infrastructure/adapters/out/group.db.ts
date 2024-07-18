import { Inject, Injectable } from '@nestjs/common';
import { PaginateParameters, Pagination } from 'src/common/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupRepository } from 'src/group/application/ports/out/group.repository';
import { GroupLog } from 'src/group/domain/group-log.model';
import { GroupVisibilityConfig } from 'src/group/domain/group-visibility-config.model';
import { Group } from 'src/group/domain/group.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupRepositoryImpl implements GroupRepository {
  constructor(
    @Inject(PrismaService)
    protected prismaService: PrismaService,
  ) {}

  private mapGroupToDomain(prisma_model: any): Group {
    if (prisma_model === null || prisma_model === undefined) return null;

    return Group.create(
      prisma_model.id,
      prisma_model.name,
      prisma_model.about,
      prisma_model.group_picture,
      prisma_model.banner_picture,
      GroupVisibilityConfig.create(
        prisma_model.id,
        prisma_model.visibility_configuration.post_visibility,
        prisma_model.visibility_configuration.event_visibility,
        prisma_model.visibility_configuration.group_visibility,
      ),
      prisma_model.created_at,
      prisma_model.updated_at,
      prisma_model.is_deleted,
    );
  }

  private mapGroupLogToDomain(prisma_model: any): GroupLog {
    if (prisma_model === null || prisma_model === undefined) return null;

    return GroupLog.create(
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
      prisma_model.text,
      prisma_model.occurred_at,
    );
  }

  public async paginate(
    params: PaginateParameters,
  ): Promise<Pagination<Group>> {
    let query = `SELECT groups.id FROM groups JOIN group_visibility_configs ON group_visibility_configs.group_id = groups.id`;

    if (params.filters) {
      if (typeof params.filters['name'] === 'string') {
        const name = params.filters['name'];
        if (query.includes('WHERE')) {
          query = `${query} AND LOWER(groups.name) LIKE '%${name.toLowerCase()}%'`;
        } else {
          query = `${query} WHERE LOWER(groups.name) LIKE '%${name.toLowerCase()}%'`;
        }
      }

      if (typeof params.filters['isDeleted'] === 'boolean') {
        const isDeleted = params.filters['isDeleted'];
        if (query.includes('WHERE')) {
          query = `${query} AND groups.is_deleted = ${isDeleted}`;
        } else {
          query = `${query} WHERE groups.is_deleted = ${isDeleted}`;
        }
      }

      if (typeof params.filters['groupVisibility'] === 'string') {
        const groupVisibility = params.filters['groupVisibility'];
        if (query.includes('WHERE')) {
          query = `${query} AND LOWER(group_visibility_configs.group_visibility) = '${groupVisibility.toLowerCase()}'`;
        } else {
          query = `${query} WHERE LOWER(group_visibility_configs.group_visibility) = '${groupVisibility.toLowerCase()}'`;
        }
      }
    }

    const ids =
      await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

    const sort = params.sort ?? 'name';
    const sortDirection = params.sortDirection ?? SortDirection.ASC;

    let orderBy = {};

    switch (sort) {
      case 'created_at':
      case 'createdAt':
        orderBy = { created_at: sortDirection };
        break;
      case 'updated_at':
      case 'updatedAt':
        orderBy = { updated_at: sortDirection };
        break;
      case 'name':
      default:
        orderBy = { name: sortDirection };
        break;
    }

    let items = [];

    const paginate = params.paginate ?? false;
    const page = params.page ?? 0;
    const limit = params.limit ?? 12;
    const total = ids.length;

    if (paginate) {
      items = await this.prismaService.group.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        include: { visibility_configuration: true },
        orderBy: orderBy,
        skip: limit * page,
        take: limit,
      });
    } else {
      items = await this.prismaService.group.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        include: { visibility_configuration: true },
        orderBy: orderBy,
      });
    }

    items = items.map((i) => {
      return this.mapGroupToDomain(i);
    });

    return new Pagination(items, total, page);
  }

  public async findBy(values: Object): Promise<Array<Group>> {
    const name = values['name'];
    const isDeleted = values['isDeleted'] ?? false;
    const visibility = values['visibility'];

    let query =
      'SELECT groups.id FROM groups JOIN group_visibility_configs ON group_visibility_configs.group_id = groups.id';

    if (name) {
      if (query.includes('WHERE')) {
        query = `${query} AND LOWER(groups.name) LIKE '%${name.toLowerCase()}%'`;
      } else {
        query = `${query} WHERE LOWER(groups.name) LIKE '%${name.toLowerCase()}%'`;
      }
    }

    if (isDeleted !== undefined) {
      if (query.includes('WHERE')) {
        query = `${query} AND groups.is_deleted = ${isDeleted}`;
      } else {
        query = `${query} WHERE groups.is_deleted = ${isDeleted}`;
      }
    }

    if (visibility) {
      if (query.includes('WHERE')) {
        query = `${query} AND LOWER(group_visibility_configs.group_visibility) = '${visibility.toLowerCase()}'`;
      } else {
        query = `${query} WHERE LOWER(group_visibility_configs.group_visibility) = '${visibility.toLowerCase()}'`;
      }
    }

    const groupIds =
      await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

    const groups = await this.prismaService.group.findMany({
      where: {
        id: { in: groupIds.map((row) => row.id) },
      },
      include: { visibility_configuration: true },
    });

    return groups.map((group) => {
      return this.mapGroupToDomain(group);
    });
  }

  public async paginateLog(
    params: PaginateParameters,
  ): Promise<Pagination<GroupLog>> {
    let query = 'SELECT id FROM group_logs';

    if (params.filters) {
      if (typeof params.filters['groupId']) {
        const groupId = params.filters['groupId'];
        if (query.includes('WHERE')) {
          query = `${query} AND group_id = '${groupId}'`;
        } else {
          query = `${query} WHERE group_id = '${groupId}'`;
        }
      }
    }

    const ids =
      await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

    const sort = params.sort ?? 'occurredAt';
    const sortDirection = params.sortDirection ?? SortDirection.ASC;

    let orderBy = {};

    switch (sort) {
      case 'text':
        orderBy = { text: sortDirection };
        break;
      case 'occurred_at':
      case 'occurredAt':
      default:
        orderBy = { occurred_at: sortDirection };
        break;
    }

    let items = [];

    const paginate = params.paginate ?? false;
    const page = params.page ?? 0;
    const limit = params.limit ?? 12;
    const total = ids.length;

    if (paginate) {
      items = await this.prismaService.groupLog.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        orderBy: orderBy,
        include: {
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
      items = await this.prismaService.groupLog.findMany({
        where: { id: { in: ids.map((row) => row.id) } },
        orderBy: orderBy,
        include: {
          group: {
            include: {
              visibility_configuration: true,
            },
          },
        },
      });
    }

    items = items.map((i) => {
      return this.mapGroupLogToDomain(i);
    });

    return new Pagination(items, total, page);
  }

  public async findAll(): Promise<Array<Group>> {
    const groups = await this.prismaService.group.findMany({
      include: { visibility_configuration: true },
    });

    return groups.map((group) => {
      return this.mapGroupToDomain(group);
    });
  }

  public async findById(id: string): Promise<Group> {
    const group = await this.prismaService.group.findFirst({
      where: { id: id },
      include: { visibility_configuration: true },
    });

    return this.mapGroupToDomain(group);
  }

  public async store(model: Group): Promise<Group> {
    const group = await this.prismaService.group.create({
      data: {
        id: model.id(),
        name: model.name(),
        about: model.about(),
        group_picture: model.groupPicture(),
        banner_picture: model.bannerPicture(),
        visibility_configuration: {
          create: {
            event_visibility: model.visibilityConfiguration().eventVisibility(),
            post_visibility: model.visibilityConfiguration().postVisibility(),
            group_visibility: model.visibilityConfiguration().groupVisibility(),
          },
        },
        created_at: model.createdAt(),
        updated_at: model.updatedAt(),
        is_deleted: model.isDeleted(),
      },
      include: {
        visibility_configuration: true,
      },
    });

    return this.mapGroupToDomain(group);
  }

  public async storeLog(model: GroupLog): Promise<GroupLog> {
    const groupLog = await this.prismaService.groupLog.create({
      data: {
        id: model.id(),
        text: model.text(),
        group_id: model.group().id(),
        occurred_at: model.occurredAt(),
      },
      include: {
        group: {
          include: {
            visibility_configuration: true,
          },
        },
      },
    });

    return this.mapGroupLogToDomain(groupLog);
  }

  public async update(model: Group): Promise<Group> {
    const group = await this.prismaService.group.update({
      data: {
        name: model.name(),
        about: model.about(),
        group_picture: model.groupPicture(),
        banner_picture: model.bannerPicture(),
        is_deleted: model.isDeleted(),
        updated_at: model.updatedAt(),
      },
      where: {
        id: model.id(),
      },
      include: {
        visibility_configuration: true,
      },
    });

    return this.mapGroupToDomain(group);
  }

  public async updateVisibilityConfiguration(
    model: GroupVisibilityConfig,
  ): Promise<Group> {
    const group = await this.prismaService.group.update({
      data: {
        visibility_configuration: {
          update: {
            event_visibility: model.eventVisibility(),
            group_visibility: model.groupVisibility(),
            post_visibility: model.postVisibility(),
          },
        },
      },
      where: { id: model.id() },
      include: {
        visibility_configuration: true,
      },
    });

    return this.mapGroupToDomain(group);
  }

  public async delete(id: string): Promise<void> {
    await this.prismaService.group.delete({
      where: { id: id },
      include: {
        visibility_configuration: true,
        join_requests: true,
        members: true,
      },
    });
  }
}

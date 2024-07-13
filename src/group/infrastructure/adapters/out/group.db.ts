import { Inject, Injectable } from "@nestjs/common";
import { GroupRepository } from "src/group/application/ports/out/group.repository";
import { GroupMember } from "src/group/domain/group-member.model";
import { GroupVisibilityConfig } from "src/group/domain/group-visibility-config.model";
import { Group } from "src/group/domain/group.model";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GroupRepositoryImpl implements GroupRepository
{
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) 
    {}

    private mapGroupToDomain(prisma_model: any): Group 
    {
        if(prisma_model === null || prisma_model === undefined) return null;

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
                prisma_model.visibility_configuration.group_visibility
            ),
            prisma_model.created_at,
            prisma_model.updated_at,
            prisma_model.is_deleted
        );
    }

    public async findBy(values: Object): Promise<Array<Group>> {
        const name = values['name'];
        const isDeleted = values['isDeleted'] ?? false;
        const visibility = values['visibility'];

        const sort = values['sort'] ?? 'name';
        const sortDirection = values['sortDirection'] ?? 'asc';
        const page = values['page'] ?? 0;
        const paginate = values['paginate'] ?? false;
        const limit = values['limit'] ?? 12;

        let query = 'SELECT groups.id FROM groups JOIN group_visibility_configs ON group_visibility_configs.id = groups.id';

        if(name) {
            if(query.includes('WHERE')) {
                query = `${query} AND groups.name LIKE '%${name}%'`;
            }else {
                query = `${query} WHERE groups.name LIKE '%${name}%'`;
            }
        }

        if(isDeleted) {
            if(query.includes('WHERE')) {
                query = `${query} AND groups.is_deleted = ${isDeleted}`;
            }else {
                query = `${query} WHERE groups.is_deleted = ${isDeleted}`;
            }
        }

        if(visibility) {
            if(query.includes('WHERE')) {
                query = `${query} AND group_visibility_configs.group_visibility = '${visibility}'`;
            }else {
                query = `${query} WHERE group_visibility_configs.group_visibility = '${visibility}`;
            }
        }

        const userIds = await this.prismaService.$queryRawUnsafe<{id: string}[]>(query);

        let orderBy = {};

        switch(sort) {
            case 'name':
                orderBy = {
                    name: sortDirection
                }
                break;
            case 'id':
            default:
                orderBy = {
                    id: sortDirection
                }
                break;
        }

        let groups = [];

        if(paginate) {
            groups = await this.prismaService.group.findMany({
                where: {
                    id: {in: userIds.map((row) => row.id)}
                },
                include: {visibility_configuration: true},
                orderBy: orderBy,
                skip: page * limit,
                take: limit
            });
        }else {
            groups = await this.prismaService.group.findMany({
                where: {
                    id: {in: userIds.map((row) => row.id)}
                },
                include: {visibility_configuration: true},
                orderBy: orderBy
            });
        }

        return groups.map((group) => {
            return this.mapGroupToDomain(group)
        });
    }

    public async findAll(): Promise<Array<Group>> 
    {
        const groups = await this.prismaService.group.findMany({
            include: {visibility_configuration: true}
        });

        return groups.map((group) => {
            return this.mapGroupToDomain(group)
        });
    }

    public async findById(id: string): Promise<Group> 
    {
        const group = await this.prismaService.group.findFirst({
            where: {id: id},
            include: {visibility_configuration: true}
        });

        return this.mapGroupToDomain(group);
    }

    public async store(model: Group): Promise<Group> 
    {
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
                        group_visibility: model.visibilityConfiguration().groupVisibility()
                    }
                },
                created_at: model.createdAt(),
                updated_at: model.updatedAt(),
                is_deleted: model.isDeleted()
            }
        });

        return this.mapGroupToDomain(group);
    }

    public async update(model: Group): Promise<Group> 
    {
        const group = await this.prismaService.group.update({
            data: {
                name: model.name(),
                about: model.about(),
                group_picture: model.groupPicture(),
                banner_picture: model.bannerPicture(),
                is_deleted: model.isDeleted(),
                updated_at: model.updatedAt()
            },
            where: {
                id: model.id()
            }
        });

        return this.mapGroupToDomain(group);
    }

    public async updateVisibilityConfiguration(model: GroupVisibilityConfig): Promise<Group> {
        const group = await this.prismaService.group.update({
            data: {
                visibility_configuration: {
                    create: {
                        event_visibility: model.eventVisibility(),
                        group_visibility: model.groupVisibility(),
                        post_visibility: model.postVisibility()
                    }
                }
            },
            where: {id: model.id()}
        });

        return this.mapGroupToDomain(group);
    }

    public async delete(id: string): Promise<void> {
        await this.prismaService.group.delete({
            where: {id: id},
            include: {
                visibility_configuration: true,
                join_requests: true,
                members: true
            }
        });
    }
}
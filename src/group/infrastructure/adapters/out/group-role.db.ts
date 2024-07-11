import { Inject, Injectable } from "@nestjs/common";
import { GroupRoleRepository } from "src/group/application/ports/out/group-role.repository";
import { GroupPermission } from "src/group/domain/group-permission.model";
import { GroupRole } from "src/group/domain/group-role.model";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GroupRoleRepositoryImpl implements GroupRoleRepository
{
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) 
    {}

    private mapGroupRoleToDomain(prisma_model: any): GroupRole 
    {
        if(prisma_model === null || prisma_model === undefined) return null;

        return GroupRole.create(
            prisma_model.id,
            prisma_model.name,
            prisma_model.hex_color,
            prisma_model.permissions.map((p) => {
                return GroupPermission.create(p.group_permission.id, p.group_permission.name);
            }),
            prisma_model.created_at,
            prisma_model.updated_at
        );
    }

    public async findBy(values: Object): Promise<Array<GroupRole>> {
        const name = values['name'];
        const isImmutable = values['isImmutable'];
        
        const sort = values['sort'] ?? 'name';
        const sortDirection = values['sortDirection'] ?? 'asc';
        const page = values['sortDirection'] ?? 0;
        const paginate = values['paginate'] ?? false;
        const limit = values['limit'] ?? 12;

        let query = 'SELECT group_roles.id FROM group_roles';

        if(name) {
            if(query.includes('WHERE')) {
                query = `${query} AND name = '${name}'`;
            }else {
                query = `${query} WHERE name = '${name}'`;
            }
        }

        if(isImmutable) {
            if(query.includes('WHERE')) {
                query = `${query} AND is_immutable = ${isImmutable}`;
            }else {
                query = `${query} WHERE is_immutable = ${isImmutable}`;
            }
        }

        const userIds = await this.prismaService.$queryRawUnsafe<{id: string}[]>(query);

        let orderBy = {};

        switch(sort) {
            case 'name':
                orderBy = {
                    name: sortDirection
                };
                
                break;
            case 'id':
            default:
                orderBy = {
                    id: sortDirection
                };

                break;
        }

        let groupRoles = [];

        if(paginate) {
            groupRoles = await this.prismaService.groupRole.findMany({
                where: {id: {in: userIds.map((row) => row.id)}},
                include: {permissions: {include: {group_permission: true}}},
                orderBy: orderBy,
                skip: page * limit,
                take: limit
            });
        }else {
            groupRoles = await this.prismaService.groupRole.findMany({
                where: {id: {in: userIds.map((row) => row.id)}},
                include: {permissions: {include: {group_permission: true}}},
                orderBy: orderBy
            });
        }

        return groupRoles.map((groupRole) => {
            return this.mapGroupRoleToDomain(groupRole);
        });
    }

    public async findAll(): Promise<Array<GroupRole>> {
        const groupRoles = await this.prismaService.groupRole.findMany({
            include: {permissions: {include: {group_permission: true}}}
        });

        return groupRoles.map((groupRole) => {
            return this.mapGroupRoleToDomain(groupRole);
        });
    }

    public async findById(id: string): Promise<GroupRole> {
        const groupRole = await this.prismaService.groupRole.findFirst({
            where: {id: id},
            include: {permissions: {include: {group_permission: true}}}
        });

        return this.mapGroupRoleToDomain(groupRole);
    }

    public async findByName(name: string): Promise<GroupRole> {
        const groupRole = await this.prismaService.groupRole.findFirst({
            where: {name: name},
            include: {permissions: {include: {group_permission: true}}}
        });

        return this.mapGroupRoleToDomain(groupRole);
    }

    public async store(model: GroupRole): Promise<GroupRole> {
        const groupRole = await this.prismaService.groupRole.create({
            data: {
                id: model.id(),
                name: model.name(),
                hex_color: model.hexColor(),
                is_immutable: model.isImmutable(),
                created_at: model.createdAt(),
                updated_at: model.updatedAt()
            },
            include: {permissions: {include: {group_permission: true}}}
        });

        return this.mapGroupRoleToDomain(groupRole);
    }

    public async update(model: GroupRole): Promise<GroupRole> 
    {
        const groupRole = await this.prismaService.groupRole.update({
            where: {id: model.id()},
            data: {
                name: model.name(),
                hex_color: model.hexColor(),
                updated_at: model.updatedAt()
            },
            include: {permissions: {include: {group_permission: true}}}
        });

        return this.mapGroupRoleToDomain(groupRole);
    }

    public async delete(id: string): Promise<void> {
        await this.prismaService.groupRole.delete({
            where: {id: id},
            include: {permissions: true}
        });
    }
}
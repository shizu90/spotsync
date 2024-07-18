import { Inject } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PrismaService } from "src/prisma/prisma.service";
import { UserRepository } from "src/user/application/ports/out/user.repository";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { User } from "src/user/domain/user.model";

export class UserRepositoryImpl implements UserRepository 
{
    public constructor(@Inject(PrismaService) protected prismaService: PrismaService) 
    {}

    private mapUserToDomain(prisma_model: any): User | null
    {
        if(prisma_model === null || prisma_model === undefined) return null;

        return User.create(
            prisma_model.id,
            prisma_model.profile_picture,
            prisma_model.banner_picture,
            prisma_model.biograph,
            prisma_model.birth_date,
            prisma_model.credentials ? UserCredentials.create(
                prisma_model.id,
                prisma_model.credentials.name,
                prisma_model.credentials.email,
                prisma_model.credentials.password,
                prisma_model.credentials.last_login,
                prisma_model.credentials.last_logout
            ) : null,
            prisma_model.visibility_configuration ? UserVisibilityConfig.create(
                prisma_model.id,
                prisma_model.visibility_configuration.profile_visibility,
                prisma_model.visibility_configuration.address_visibility,
                prisma_model.visibility_configuration.poi_folder_visibility,
                prisma_model.visibility_configuration.visited_poi_visibility,
                prisma_model.visibility_configuration.post_visibility
            ) : null,
            prisma_model.created_at,
            prisma_model.updated_at,
            prisma_model.is_deleted
        );
    }

    public async paginate(params: PaginateParameters): Promise<Pagination<User>> 
    {
        let query = 'SELECT users.id FROM users JOIN user_credentials ON user_credentials.user_id = users.id';

        if(params.filters) {
            if(typeof params.filters['name'] === 'string') {
                const name = params.filters['name'];
                if(query.includes('WHERE')) {
                    query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
                }else {
                    query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
                }
            }

            if(typeof params.filters['isDeleted'] === 'boolean') {
                const isDeleted = params.filters['isDeleted'];
                
                if(query.includes('WHERE')) {
                    query = `${query} AND users.is_deleted = '${isDeleted}'`;
                }else {
                    query = `${query} WHERE users.is_deleted = '${isDeleted}'`;
                }
            }
        }

        const ids = await this.prismaService.$queryRawUnsafe<{id: string}[]>(query);

        const sort = params.sort ?? 'name';
        const sortDirection = params.sortDirection ?? SortDirection.ASC;

        let orderBy = {};

        switch(sort) {
            case 'created_at':
            case 'createdAt':
                orderBy = {created_at: sortDirection};
                break;
            case 'updated_at':
            case 'updatedAt':
                orderBy = {updated_at: sortDirection};
                break;
            case 'name':
            default:
                orderBy = {credentials: {name: sortDirection}};
                break;
        }

        let items = [];

        const paginate = params.paginate ?? false;
        const page = params.page ?? 0;
        const limit = params.limit ?? 12;
        const total = ids.length;

        if(paginate) {
            items = await this.prismaService.user.findMany({
                where: {id: {in: ids.map((row) => row.id)}},
                orderBy: orderBy,
                include: {credentials: true, visibility_configuration: true},
                skip: limit * page,
                take: limit 
            });
        }else {
            items = await this.prismaService.user.findMany({
                where: {id: {in: ids.map((row) => row.id)}},
                orderBy: orderBy,
                include: {credentials: true, visibility_configuration: true}
            });
        }

        items = items.map((i) => {
            return this.mapUserToDomain(i);
        });

        return new Pagination(items, total, page);
    }

    public async findBy(values: Object): Promise<Array<User>>
    {
        const name = values['name'];
        const isDeleted = values['isDeleted'] ?? false;

        let query = 'SELECT users.id FROM users JOIN user_credentials ON user_credentials.user_id = users.id';

        if(name) {
            if(query.includes('WHERE')) {
                query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
            }else {
                query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
            }
        }

        if(isDeleted !== undefined) {
            if(query.includes('WHERE')) {
                query = `${query} AND users.is_deleted = '${isDeleted}'`;
            }else {
                query = `${query} WHERE users.is_deleted = '${isDeleted}'`;
            }
        }

        const userIds = await this.prismaService.$queryRawUnsafe<{id: string}[]>(query);

        const users = await this.prismaService.user.findMany({
            where: {
                id: {in: userIds.map((row) => row.id)}
            },
            include: {credentials: true, visibility_configuration: true}
        });

        return users.map((user) => {
            return this.mapUserToDomain(user);
        });
    }

    public async findAll(): Promise<Array<User>> 
    {
        const users = await this.prismaService.user.findMany({
            include: {
                credentials: true,
                visibility_configuration: true
            }
        });

        return users.map((user): User => {
            return this.mapUserToDomain(user);
        });
    }

    public async findById(id: string): Promise<User> {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: id
            },
            include: {
                credentials: true,
                visibility_configuration: true
            },
        });

        return this.mapUserToDomain(user);
    }

    public async findByName(name: string): Promise<User> 
    {
        const user = await this.prismaService.user.findFirst({
            where: {
                credentials: {
                    name: name
                }
            },
            include: {
                credentials: true,
                visibility_configuration: true
            }
        });

        return this.mapUserToDomain(user);
    }

    public async findByEmail(email: string): Promise<User> 
    {
        const user = await this.prismaService.user.findFirst({
            where: {
                credentials: {
                    email: email
                }
            },
            include: {
                credentials: true,
                visibility_configuration: true
            }
        });

        return this.mapUserToDomain(user);
    }

    public async store(model: User): Promise<User> 
    {
        const user = await this.prismaService.user.create({
            data: {
                id: model.id(),
                banner_picture: model.bannerPicture(),
                profile_picture: model.profilePicture(),
                biograph: model.biograph(),
                birth_date: model.birthDate(),
                is_deleted: model.isDeleted(),
                created_at: model.createdAt(),
                updated_at: model.updatedAt(),
                credentials: {
                    create: {
                        name: model.credentials().name(),
                        email: model.credentials().email(),
                        password: model.credentials().password()
                    }
                },
                visibility_configuration: {
                    create: {
                        profile_visibility: model.visibilityConfiguration().profileVisibility(),
                        address_visibility: model.visibilityConfiguration().addressVisibility(),
                        poi_folder_visibility: model.visibilityConfiguration().poiFolderVisibility(),
                        visited_poi_visibility: model.visibilityConfiguration().visitedPoiVisibility(),
                        post_visibility: model.visibilityConfiguration().postVisibility()
                    }
                }
            },
            include: {
                credentials: true,
                visibility_configuration: true
            }
        });

        return this.mapUserToDomain(user);
    }

    public async update(model: User): Promise<User> 
    {
        const user = await this.prismaService.user.update({
            data: {
                biograph: model.biograph(),
                banner_picture: model.bannerPicture(),
                profile_picture: model.profilePicture(),
                birth_date: model.birthDate(),
                is_deleted: model.isDeleted(),
                updated_at: model.updatedAt()
            },
            where: {
                id: model.id()
            },
            include: {
                credentials: true,
                visibility_configuration: true
            }
        });

        return this.mapUserToDomain(user);
    }

    public async updateCredentials(model: UserCredentials): Promise<User> 
    {
        const user = await this.prismaService.user.update({
            data: {
                credentials: {
                    update: {
                        where: {user_id: model.id()},
                        data: {
                            email: model.email(),
                            name: model.name(),
                            password: model.password(),
                            last_login: model.lastLogin(),
                            last_logout: model.lastLogout()
                        }
                    }
                }
            },
            where: {
                id: model.id()
            },
            include: {
                credentials: true,
                visibility_configuration: true
            }
        });

        return this.mapUserToDomain(user);
    }

    public async updateVisibilityConfig(userVisibilityConfig: UserVisibilityConfig): Promise<User> {
        const user = await this.prismaService.user.update({
            where: {id: userVisibilityConfig.id()},
            data: {
                visibility_configuration: {
                    update: {
                        data: {
                            profile_visibility: userVisibilityConfig.profileVisibility(),
                            address_visibility: userVisibilityConfig.addressVisibility(),
                            poi_folder_visibility: userVisibilityConfig.poiFolderVisibility(),
                            visited_poi_visibility: userVisibilityConfig.visitedPoiVisibility(),
                            post_visibility: userVisibilityConfig.postVisibility()
                        }
                    }
                }
            },
            include: {
                credentials: true,
                visibility_configuration: true
            }
        });

        return this.mapUserToDomain(user);
    }

    public async delete(id: string): Promise<void> 
    {
        await this.prismaService.user.delete({
            where: {id: id},
            include: {
                credentials: true,
                addresses: true,
                visibility_configuration: true
            }
        });
    }
}
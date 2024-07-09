import { Inject } from "@nestjs/common";
import { FollowRepository } from "src/follower/application/ports/out/follow.repository";
import { Follow } from "src/follower/domain/follow.model";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { User } from "src/user/domain/user.model";

export class FollowRepositoryImpl implements FollowRepository 
{
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) 
    {}

    private mapToDomain(prisma_model: any): Follow 
    {
        if(prisma_model === null || prisma_model === undefined) return null;

        return Follow.create(
            prisma_model.id,
            User.create(
                prisma_model.from_user.id,
                prisma_model.from_user.profile_picture,
                prisma_model.from_user.banner_picture,
                prisma_model.from_user.biograph,
                prisma_model.from_user.birth_date,
                UserCredentials.create(
                    prisma_model.from_user.id,
                    prisma_model.from_user.credentials.name,
                    prisma_model.from_user.credentials.email,
                    prisma_model.from_user.credentials.password,
                    prisma_model.from_user.credentials.last_login,
                    prisma_model.from_user.credentials.last_logout
                ),
                UserVisibilityConfig.create(
                    prisma_model.from_user.id,
                    prisma_model.from_user.visibility_configuration.profile_visibility,
                    prisma_model.from_user.visibility_configuration.address_visiblity,
                    prisma_model.from_user.visibility_configuration.poi_folder_visibility,
                    prisma_model.from_user.visibility_configuration.visited_poi_visibility,
                    prisma_model.from_user.visibility_configuration.post_visibility
                ),
                prisma_model.from_user.created_at,
                prisma_model.from_user.updated_at,
                prisma_model.from_user.is_deleted
            ),
            User.create(
                prisma_model.to_user.id,
                prisma_model.to_user.profile_picture,
                prisma_model.to_user.banner_picture,
                prisma_model.to_user.biograph,
                prisma_model.to_user.birth_date,
                UserCredentials.create(
                    prisma_model.to_user.id,
                    prisma_model.to_user.credentials.name,
                    prisma_model.to_user.credentials.email,
                    prisma_model.to_user.credentials.password,
                    prisma_model.to_user.credentials.last_login,
                    prisma_model.to_user.credentials.last_logout
                ),
                UserVisibilityConfig.create(
                    prisma_model.to_user.id,
                    prisma_model.to_user.visibility_configuration.profile_visibility,
                    prisma_model.to_user.visibility_configuration.address_visiblity,
                    prisma_model.to_user.visibility_configuration.poi_folder_visibility,
                    prisma_model.to_user.visibility_configuration.visited_poi_visibility,
                    prisma_model.to_user.visibility_configuration.post_visibility
                ),
                prisma_model.to_user.created_at,
                prisma_model.to_user.updated_at,
                prisma_model.to_user.is_deleted
            ),
            prisma_model.created_at
        );
    }

    public async findBy(values: Object): Promise<Array<Follow>> {
        const fromUserId = values['fromUserId'];
        const toUserId = values['toUserId'];

        let query = 'SELECT id FROM follow';

        if(fromUserId) {
            if(query.includes('WHERE')) {
                query = `${query} AND from_user_id = '${fromUserId}'`;
            }else {
                query = `${query} WHERE from_user_id = '${fromUserId}'`;
            }
        }

        if(toUserId) {
            if(query.includes('WHERE')) {
                query = `${query} AND to_user_id = '${toUserId}'`;
            }else {
                query = `${query} WHERE to_user_id = '${toUserId}'`;
            }
        }

        const followIds = await this.prismaService.$queryRawUnsafe<{id: string}[]>(query);
        
        const follows = await this.prismaService.follow.findMany({
            where: {
                id: {in: followIds.map((row) => row.id)}
            },
            include: {
                from_user: {
                    include: {
                        credentials: true,
                        visibility_configuration: true
                    }
                },
                to_user: {
                    include: {
                        credentials: true,
                        visibility_configuration: true
                    }
                }
            }
        });

        return follows.map((follow) => {
            return this.mapToDomain(follow);
        });
    }

    public async findAll(): Promise<Array<Follow>> {
        const follows = await this.prismaService.follow.findMany({
            include: {
                from_user: {
                    include: {
                        credentials: true
                    }
                },
                to_user: {
                    include: {
                        credentials: true
                    }
                }
            }
        });

        return follows.map((follow) => {
            return this.mapToDomain(follow);
        });
    }

    public async findById(id: string): Promise<Follow> {
        const follow = await this.prismaService.follow.findFirst({
            where: {
                id: id
            },
            include: {
                from_user: {
                    include: {
                        credentials: true
                    }
                },
                to_user: {
                    include: {
                        credentials: true
                    }
                }
            }
        })
        
        return this.mapToDomain(follow);
    }

    public async store(model: Follow): Promise<Follow> {
        const follow = await this.prismaService.follow.create({
            data: {
                id: model.id(),
                from_user_id: model.from().id(),
                to_user_id: model.to().id()
            },
            include: {
                from_user: {
                    include: {
                        credentials: true
                    }
                },
                to_user: {
                    include: {
                        credentials: true
                    }
                }
            }
        });
        
        return this.mapToDomain(follow);
    }

    public async update(model: Follow): Promise<Follow> {
        const follow = await this.prismaService.follow.update({
            where: {id: model.id()},
            data: {
                from_user_id: model.from().id(),
                to_user_id: model.to().id()
            },
            include: {
                from_user: {
                    include: {
                        credentials: true
                    }
                },
                to_user: {
                    include: {
                        credentials: true
                    }
                }
            }
        });
        
        return this.mapToDomain(follow);
    }

    public async delete(id: string): Promise<void> {
        await this.prismaService.follow.delete({
            where: {
                id: id
            }
        });
    }
}
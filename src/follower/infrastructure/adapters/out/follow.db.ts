import { Inject } from "@nestjs/common";
import { FollowRepository } from "src/follower/application/ports/out/follow.repository";
import { Follow } from "src/follower/domain/follow.model";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { User } from "src/user/domain/user.model";

export class FollowRepositoryImpl implements FollowRepository 
{
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) 
    {}

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
            if(follow) {
                return Follow.create(
                    follow.id,
                    User.create(
                        follow.from_user.id,
                        follow.from_user.profile_picture,
                        follow.from_user.banner_picture,
                        follow.from_user.biograph,
                        follow.from_user.birth_date,
                        follow.from_user.profile_visibility,
                        UserCredentials.create(
                            follow.from_user.id,
                            follow.from_user.credentials.name,
                            follow.from_user.credentials.email,
                            follow.from_user.credentials.password,
                            follow.from_user.credentials.last_login,
                            follow.from_user.credentials.last_logout
                        ),
                        follow.from_user.created_at,
                        follow.from_user.updated_at,
                        follow.from_user.is_deleted
                    ),
                    User.create(
                        follow.to_user.id,
                        follow.to_user.profile_picture,
                        follow.to_user.banner_picture,
                        follow.to_user.biograph,
                        follow.to_user.birth_date,
                        follow.to_user.profile_visibility,
                        UserCredentials.create(
                            follow.to_user.id,
                            follow.to_user.credentials.name,
                            follow.to_user.credentials.email,
                            follow.to_user.credentials.password,
                            follow.to_user.credentials.last_login,
                            follow.to_user.credentials.last_logout
                        ),
                        follow.to_user.created_at,
                        follow.to_user.updated_at,
                        follow.to_user.is_deleted
                    )
                );
            }else {
                return null;
            }
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
            if(follow) {
                return Follow.create(
                    follow.id,
                    User.create(
                        follow.from_user.id,
                        follow.from_user.profile_picture,
                        follow.from_user.banner_picture,
                        follow.from_user.biograph,
                        follow.from_user.birth_date,
                        follow.from_user.profile_visibility,
                        UserCredentials.create(
                            follow.from_user.id,
                            follow.from_user.credentials.name,
                            follow.from_user.credentials.email,
                            follow.from_user.credentials.password,
                            follow.from_user.credentials.last_login,
                            follow.from_user.credentials.last_logout
                        ),
                        follow.from_user.created_at,
                        follow.from_user.updated_at,
                        follow.from_user.is_deleted
                    ),
                    User.create(
                        follow.to_user.id,
                        follow.to_user.profile_picture,
                        follow.to_user.banner_picture,
                        follow.to_user.biograph,
                        follow.to_user.birth_date,
                        follow.to_user.profile_visibility,
                        UserCredentials.create(
                            follow.to_user.id,
                            follow.to_user.credentials.name,
                            follow.to_user.credentials.email,
                            follow.to_user.credentials.password,
                            follow.to_user.credentials.last_login,
                            follow.to_user.credentials.last_logout
                        ),
                        follow.to_user.created_at,
                        follow.to_user.updated_at,
                        follow.to_user.is_deleted
                    )
                );
            }
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
        
        if(follow === null || follow === undefined) return null;

        return Follow.create(
            follow.id,
            User.create(
                follow.from_user.id,
                follow.from_user.profile_picture,
                follow.from_user.banner_picture,
                follow.from_user.biograph,
                follow.from_user.birth_date,
                follow.from_user.profile_visibility,
                UserCredentials.create(
                    follow.from_user.id,
                    follow.from_user.credentials.name,
                    follow.from_user.credentials.email,
                    follow.from_user.credentials.password,
                    follow.from_user.credentials.last_login,
                    follow.from_user.credentials.last_logout
                ),
                follow.from_user.created_at,
                follow.from_user.updated_at,
                follow.from_user.is_deleted
            ),
            User.create(
                follow.to_user.id,
                follow.to_user.profile_picture,
                follow.to_user.banner_picture,
                follow.to_user.biograph,
                follow.to_user.birth_date,
                follow.to_user.profile_visibility,
                UserCredentials.create(
                    follow.to_user.id,
                    follow.to_user.credentials.name,
                    follow.to_user.credentials.email,
                    follow.to_user.credentials.password,
                    follow.to_user.credentials.last_login,
                    follow.to_user.credentials.last_logout
                ),
                follow.to_user.created_at,
                follow.to_user.updated_at,
                follow.to_user.is_deleted
            )
        );
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
        
        if(follow === null || follow === undefined) return null;

        return Follow.create(
            follow.id,
            User.create(
                follow.from_user.id,
                follow.from_user.profile_picture,
                follow.from_user.banner_picture,
                follow.from_user.biograph,
                follow.from_user.birth_date,
                follow.from_user.profile_visibility,
                UserCredentials.create(
                    follow.from_user.id,
                    follow.from_user.credentials.name,
                    follow.from_user.credentials.email,
                    follow.from_user.credentials.password,
                    follow.from_user.credentials.last_login,
                    follow.from_user.credentials.last_logout
                ),
                follow.from_user.created_at,
                follow.from_user.updated_at,
                follow.from_user.is_deleted
            ),
            User.create(
                follow.to_user.id,
                follow.to_user.profile_picture,
                follow.to_user.banner_picture,
                follow.to_user.biograph,
                follow.to_user.birth_date,
                follow.to_user.profile_visibility,
                UserCredentials.create(
                    follow.to_user.id,
                    follow.to_user.credentials.name,
                    follow.to_user.credentials.email,
                    follow.to_user.credentials.password,
                    follow.to_user.credentials.last_login,
                    follow.to_user.credentials.last_logout
                ),
                follow.to_user.created_at,
                follow.to_user.updated_at,
                follow.to_user.is_deleted
            )
        );
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
        
        if(follow === null || follow === undefined) return null;

        return Follow.create(
            follow.id,
            User.create(
                follow.from_user.id,
                follow.from_user.profile_picture,
                follow.from_user.banner_picture,
                follow.from_user.biograph,
                follow.from_user.birth_date,
                follow.from_user.profile_visibility,
                UserCredentials.create(
                    follow.from_user.id,
                    follow.from_user.credentials.name,
                    follow.from_user.credentials.email,
                    follow.from_user.credentials.password,
                    follow.from_user.credentials.last_login,
                    follow.from_user.credentials.last_logout
                ),
                follow.from_user.created_at,
                follow.from_user.updated_at,
                follow.from_user.is_deleted
            ),
            User.create(
                follow.to_user.id,
                follow.to_user.profile_picture,
                follow.to_user.banner_picture,
                follow.to_user.biograph,
                follow.to_user.birth_date,
                follow.to_user.profile_visibility,
                UserCredentials.create(
                    follow.to_user.id,
                    follow.to_user.credentials.name,
                    follow.to_user.credentials.email,
                    follow.to_user.credentials.password,
                    follow.to_user.credentials.last_login,
                    follow.to_user.credentials.last_logout
                ),
                follow.to_user.created_at,
                follow.to_user.updated_at,
                follow.to_user.is_deleted
            )
        );
    }

    public async delete(id: string): Promise<void> {
        await this.prismaService.follow.delete({
            where: {
                id: id
            }
        });
    }
}
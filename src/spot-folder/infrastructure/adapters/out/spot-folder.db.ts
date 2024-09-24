import { Inject, Injectable } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PrismaService } from "src/prisma/prisma.service";
import { SpotFolderRepository } from "src/spot-folder/application/ports/out/spot-folder.repository";
import { SpotFolderItem } from "src/spot-folder/domain/spot-folder-item.model";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { SpotAddress } from "src/spot/domain/spot-address.model";
import { SpotPhoto } from "src/spot/domain/spot-photo.model";
import { Spot } from "src/spot/domain/spot.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserProfile } from "src/user/domain/user-profile.model";
import { UserVisibilitySettings } from "src/user/domain/user-visibility-settings.model";
import { User } from "src/user/domain/user.model";

@Injectable()
export class SpotFolderRepositoryImpl implements SpotFolderRepository 
{
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) {}

    private mapSpotFolderToDomain(prisma_model: any): SpotFolder {
        if (prisma_model === undefined || prisma_model === null) return null;

        return SpotFolder.create(
            prisma_model.id,
            prisma_model.name,
            prisma_model.description,
            prisma_model.hex_color,
            prisma_model.visibility,
            User.create(
                prisma_model.creator.id,
                UserProfile.create(
                    prisma_model.creator.id,
                    prisma_model.creator.profile.birth_date,
                    prisma_model.creator.profile.display_name,
                    prisma_model.creator.profile.theme_color,
                    prisma_model.creator.profile.profile_picture,
                    prisma_model.creator.profile.banner_picture,
                    prisma_model.creator.profile.biograph,
                    prisma_model.creator.profile.visibility,
                ),
                UserCredentials.create(
                    prisma_model.creator.id,
                    prisma_model.creator.credentials.name,
                    prisma_model.creator.credentials.email,
                    prisma_model.creator.credentials.password,
                    prisma_model.creator.credentials.phone_number,
                    prisma_model.creator.credentials.last_login,
                    prisma_model.creator.credentials.last_logout,
                ),
                UserVisibilitySettings.create(
                    prisma_model.creator.id,
                    prisma_model.creator.visibility_settings.profile,
                    prisma_model.creator.visibility_settings.addresses,
                    prisma_model.creator.visibility_settings.spot_folders,
                    prisma_model.creator.visibility_settings.visited_spots,
                    prisma_model.creator.visibility_settings.posts,
                    prisma_model.creator.visibility_settings.favorite_spots,
                    prisma_model.creator.visibility_settings.favorite_spot_folders,
                    prisma_model.creator.visibility_settings.favorite_spot_events,
                ),
                prisma_model.creator.status,
                prisma_model.creator.created_at,
                prisma_model.creator.updated_at,
                prisma_model.creator.is_deleted
            ),
            prisma_model.spots.map(s => {
                return SpotFolderItem.create(
                    Spot.create(
                        s.spot.id,
                        s.spot.name,
                        s.spot.description,
                        s.spot.type,
                        SpotAddress.create(
                            s.spot.id,
                            s.spot.address.area,
                            s.spot.address.sub_area,
                            s.spot.address.latitude,
                            s.spot.address.longitude,
                            s.spot.address.country_code,
                            s.spot.address.locality,
                        ),
                        s.spot.photos.map(p => {
                            return SpotPhoto.create(
                                p.id,
                                p.file_path
                            )
                        }),
                        User.create(
                            s.spot.creator.id,
                            UserProfile.create(
                                s.spot.creator.id,
                                s.spot.creator.profile.birth_date,
                                s.spot.creator.profile.display_name,
                                s.spot.creator.profile.theme_color,
                                s.spot.creator.profile.profile_picture,
                                s.spot.creator.profile.banner_picture,
                                s.spot.creator.profile.biograph,
                                s.spot.creator.profile.visibility,
                            ),
                            UserCredentials.create(
                                s.spot.creator.id,
                                s.spot.creator.credentials.name,
                                s.spot.creator.credentials.email,
                                s.spot.creator.credentials.password,
                                s.spot.creator.credentials.phone_number,
                                s.spot.creator.credentials.last_login,
                                s.spot.creator.credentials.last_logout,
                            ),
                            UserVisibilitySettings.create(
                                s.spot.creator.id,
                                s.spot.creator.visibility_settings.profile,
                                s.spot.creator.visibility_settings.addresses,
                                s.spot.creator.visibility_settings.spot_folders,
                                s.spot.creator.visibility_settings.visited_spots,
                                s.spot.creator.visibility_settings.posts,
                                s.spot.creator.visibility_settings.favorite_spots,
                                s.spot.creator.visibility_settings.favorite_spot_folders,
                                s.spot.creator.visibility_settings.favorite_spot_events,
                            ),
                            s.spot.creator.status,
                            s.spot.creator.created_at,
                            s.spot.creator.updated_at,
                            s.spot.creator.is_deleted
                        ),
                        s.spot.created_at,
                        s.spot.updated_at,
                        s.spot.is_deleted
                    ),
                    s.order_number,
                    s.added_at
                )
            }),
            prisma_model.created_at,
            prisma_model.updated_at
        );
    }

    public async paginate(params: PaginateParameters): Promise<Pagination<SpotFolder>> {
        let query = `SELECT spot_folders.id FROM spot_folders`;

        if (params.filters) {
            if (typeof params.filters['userId'] === 'string') {
                const userId = params.filters['userId'];

                if (query.includes('WHERE')) {
                    query = `${query} AND user_id = '${userId}'`;
                } else {
                    query = `${query} WHERE user_id = '${userId}'`;
                }
            }

            if (typeof params.filters['name'] === 'string') {
                const name = params.filters['name'];

                if (query.includes('WHERE')) {
                    query = `${query} AND name ILIKE '%${name}%'`;
                } else {
                    query = `${query} WHERE name ILIKE '%${name}%'`;
                }
            }
        }

        const ids = await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

        const sort = params.sort || 'created_at';
        const sortDirection = params.sortDirection || SortDirection.DESC;

        let orderBy = {};

        switch(sort) {
            case 'name':
                orderBy = {
                    name: sortDirection,
                };
                break;
            case 'created_at':
            case 'createdAt':
            default:
                orderBy = {
                    created_at: sortDirection,
                };
                break;
        }

        let items = [];

        const paginate = params.paginate ?? false;
        const page = (params.page ?? 1) - 1;
        const limit = params.limit ?? 12;
        const total = ids.length;

        if (paginate) {
            items = await this.prismaService.spotFolder.findMany({
                where: { id: { in: ids.map((row) => row.id) } },
                orderBy: orderBy,
                include: {
                    creator: {
                        include: {
                            credentials: true,
                            visibility_settings: true,
                            profile: true,
                        }
                    },
                    spots: {
                        include: {
                            spot: {
                                include: {
                                    address: true
                                }
                            }
                        }
                    }
                },
                skip: page * limit,
                take: limit
            });
        } else {
            items = await this.prismaService.spotFolder.findMany({
                where: { id: { in: ids.map((row) => row.id) } },
                orderBy: orderBy,
                include: {
                    creator: {
                        include: {
                            credentials: true,
                            visibility_settings: true,
                            profile: true,
                        }
                    },
                    spots: {
                        include: {
                            spot: {
                                include: {
                                    address: true
                                }
                            }
                        }
                    }
                }
            });
        }

        return new Pagination(
            items.map(item => this.mapSpotFolderToDomain(item)),
            total,
            page + 1,
            limit
        );
    }

    public async findBy(values: Object): Promise<SpotFolder[]> {
        const name = values['name'] ?? null;
        const userId = values['userId'] ?? null;
        const visibility = values['visibility'] ?? null;
        
        let query = `SELECT spot_folders.id FROM spot_folders`;

        if (name !== null) {
            if (query.includes('WHERE')) {
                query = `${query} AND name = '${name}'`;
            } else {
                query = `${query} WHERE name = '${name}'`;
            }
        }

        if (userId !== null) {
            if (query.includes('WHERE')) {
                query = `${query} AND user_id = '${userId}'`;
            } else {
                query = `${query} WHERE user_id = '${userId}'`;
            }
        }

        if (visibility !== null) {
            if (query.includes('WHERE')) {
                query = `${query} AND visibility = '${visibility}'`;
            } else {
                query = `${query} WHERE visibility = '${visibility}'`;
            }
        }

        const ids = await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

        const items = await this.prismaService.spotFolder.findMany({
            where: { id: { in: ids.map((row) => row.id) } },
            include: {
                creator: {
                    include: {
                        credentials: true,
                        visibility_settings: true,
                        profile: true,
                    }
                },
                spots: {
                    include: {
                        spot: {
                            include: {
                                address: true
                            }
                        }
                    }
                }
            }
        });

        return items.map(item => this.mapSpotFolderToDomain(item));
    }

    public async countBy(values: Object): Promise<number> {
        const name = values['name'] ?? null;
        const userId = values['userId'] ?? null;
        const visibility = values['visibility'] ?? null;
        
        let query = `SELECT count(spot_folders.id) FROM spot_folders`;

        if (name !== null) {
            if (query.includes('WHERE')) {
                query = `${query} AND name = '${name}'`;
            } else {
                query = `${query} WHERE name = '${name}'`;
            }
        }

        if (userId !== null) {
            if (query.includes('WHERE')) {
                query = `${query} AND user_id = '${userId}'`;
            } else {
                query = `${query} WHERE user_id = '${userId}'`;
            }
        }

        if (visibility !== null) {
            if (query.includes('WHERE')) {
                query = `${query} AND visibility = '${visibility}'`;
            } else {
                query = `${query} WHERE visibility = '${visibility}'`;
            }
        }

        const count = await this.prismaService.$queryRawUnsafe<{ count: number }>(query);

        return count.count;
    }

    public async findAll(): Promise<SpotFolder[]> {
        const items = await this.prismaService.spotFolder.findMany({
            include: {
                creator: {
                    include: {
                        credentials: true,
                        visibility_settings: true,
                        profile: true,
                    }
                },
                spots: {
                    include: {
                        spot: {
                            include: {
                                address: true
                            }
                        }
                    }
                }
            }
        });

        return items.map(item => this.mapSpotFolderToDomain(item));
    }

    public async findById(id: string): Promise<SpotFolder> {
        const item = await this.prismaService.spotFolder.findUnique({
            where: {
                id: id
            },
            include: {
                creator: {
                    include: {
                        credentials: true,
                        visibility_settings: true,
                        profile: true,
                    }
                },
                spots: {
                    include: {
                        spot: {
                            include: {
                                address: true
                            }
                        }
                    }
                }
            }
        });

        return this.mapSpotFolderToDomain(item);
    }

    public async store(model: SpotFolder): Promise<SpotFolder> {
        const spotFolder = await this.prismaService.spotFolder.create({
            data: {
                id: model.id(),
                name: model.name(),
                hex_color: model.hexColor(),
                description: model.description(),
                visibility: model.visibility(),
                created_at: model.createdAt(),
                updated_at: model.updatedAt(),
                user_id: model.creator().id(),
                spots: {
                    createMany: {
                        data: model.items().map(item => {
                            return {
                                spot_id: item.spot().id(),
                                order_number: item.orderNumber(),
                                added_at: item.addedAt()
                            }
                        })
                    }
                }
            },
            include: {
                creator: {
                    include: {
                        credentials: true,
                        visibility_settings: true,
                        profile: true,
                    }
                },
                spots: {
                    include: {
                        spot: {
                            include: {
                                address: true
                            }
                        }
                    }
                }
            }
        });

        return this.mapSpotFolderToDomain(spotFolder);
    }

    public async update(model: SpotFolder): Promise<void> {
        await this.prismaService.spotFolder.update({
            data: {
                name: model.name(),
                hex_color: model.hexColor(),
                description: model.description(),
                visibility: model.visibility(),
                updated_at: model.updatedAt(),
            },
            where: {
                id: model.id(),
            }
        });

        for (const item of model.items()) {
            await this.prismaService.spotFolderItem.upsert({
                create: {
                    spot_id: item.spot().id(),
                    order_number: item.orderNumber(),
                    added_at: item.addedAt(),
                    spot_folder_id: model.id(),
                },
                update: {
                    order_number: item.orderNumber(),
                },
                where: {
                    spot_folder_id_spot_id: {
                        spot_folder_id: model.id(),
                        spot_id: item.spot().id(),
                    }
                }
            });
        }
    }

    public async delete(id: string): Promise<void> {
        await this.prismaService.spotFolder.delete({
            where: {
                id: id
            }
        });
    }
}
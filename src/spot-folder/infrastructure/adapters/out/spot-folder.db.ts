import { Inject, Injectable } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PrismaService } from "src/prisma/prisma.service";
import { SpotFolderRepository } from "src/spot-folder/application/ports/out/spot-folder.repository";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { SpotFolderEntityMapper } from "./mappers/spot-folder-entity.mapper";

@Injectable()
export class SpotFolderRepositoryImpl implements SpotFolderRepository 
{
    private _spotFolderEntityMapper: SpotFolderEntityMapper = new SpotFolderEntityMapper();

    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) {}

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
            items.map(item => this._spotFolderEntityMapper.toModel(item)),
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

        return items.map(item => this._spotFolderEntityMapper.toModel(item));
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

        return items.map(item => this._spotFolderEntityMapper.toModel(item));
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

        return this._spotFolderEntityMapper.toModel(item);
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

        return this._spotFolderEntityMapper.toModel(spotFolder);
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
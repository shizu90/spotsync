import { Inject, Injectable } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { FavoriteRepository } from "src/favorite/application/ports/out/favorite.repository";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { Favorite } from "src/favorite/domain/favorite.model";
import { PrismaService } from "src/prisma/prisma.service";
import { FavoriteEntityMapper } from "./mappers/favorite-entity.mapper";

@Injectable()
export class FavoriteRepositoryImpl implements FavoriteRepository {
    private _favoriteEntityMapper: FavoriteEntityMapper = new FavoriteEntityMapper();

    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) {}

    private _mapSubjectId(subject: FavoritableSubject): string {
        switch(subject) {
            case FavoritableSubject.SPOT:
                return 'spot_id';
            case FavoritableSubject.SPOT_EVENT:
                return 'spot_event_id';
            case FavoritableSubject.SPOT_FOLDER:
                return 'spot_folder_id';
            default:
                return 'spot_id';
        }
    }

    private _mountInclude(): Object {
        return {
            spot: {
                include: {
                    address: true,
                    creator: {
                        include: {
                            credentials: true,
                            profile: true,
                            visibility_settings: true,
                        }
                    },
                    photos: true,
                }
            },
            spot_folder: {
                include: {
                    creator: {
                        include: {
                            credentials: true,
                            profile: true,
                            visibility_settings: true,
                        }
                    },
                    spots: {
                        include: {
                            spot: {
                                include: {
                                    photos: true,
                                    creator: {
                                        include: {
                                            credentials: true,
                                            profile: true,
                                            visibility_settings: true,
                                        }
                                    },
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    private _mountQuery(values: Object): Object {
        const subject = values['subject'] ?? null;
        const subjectId = values['subjectId'] ?? null;
        const userId = values['userId'] ?? null;

        let query = {};

        if (subject) {
            query['subject'] = subject;
        }

        if (subjectId && subject) {
            query[this._mapSubjectId(subject)] = subjectId;
        }

        if (userId) {
            query['user_id'] = userId;
        }

        return query;
    }

    public async paginate(params: PaginateParameters): Promise<Pagination<Favorite>> {
        const query = this._mountQuery(params.filters);
        const sort = params.sort ?? 'created_at';
        const sortDirection = params.sortDirection ?? SortDirection.DESC;

        let orderBy = {};

        switch(sort) {
            case 'createdAt':
            case 'created_at':
            default:
                orderBy = { created_at: sortDirection };
                break;
        }

        const paginate = params.paginate ?? false;
        const limit = params.limit ?? 12;
        const page = (params.page ?? 1)-1;
        const total = await this.countBy(params.filters);

        let items = [];

        if (paginate) {
            items = await this.prismaService.favorite.findMany({
                where: query,
                orderBy: orderBy,
                skip: page * limit,
                take: limit,
                include: this._mountInclude(),
            });
        } else {
            items = await this.prismaService.favorite.findMany({
                where: query,
                orderBy: orderBy,
                include: this._mountInclude(),
            });
        }

        return new Pagination<Favorite>(
            items.map(i => this._favoriteEntityMapper.toModel(i)),
            total,
            limit,
            page,
        );
    }
    
    public async findBy(values: Object): Promise<Favorite[]> {
        const query = this._mountQuery(values);
        const items = await this.prismaService.favorite.findMany({
            where: query,
            include: this._mountInclude(),
        });

        return items.map(i => this._favoriteEntityMapper.toModel(i));
    }
    
    public async countBy(values: Object): Promise<number> {
        const query = this._mountQuery(values);
        return this.prismaService.favorite.count({
            where: query,
        });
    }
    
    public async findById(id: string): Promise<Favorite> {
        const item = await this.prismaService.favorite.findUnique({
            where: {
                id: id,
            },
            include: this._mountInclude(),
        });

        return this._favoriteEntityMapper.toModel(item);
    }
    
    public async findAll(): Promise<Favorite[]> {
        const items = await this.prismaService.favorite.findMany({
            include: this._mountInclude(),
        });

        return items.map(i => this._favoriteEntityMapper.toModel(i));
    }
    
    public async store(model: Favorite): Promise<Favorite> {
        const favorite = await this.prismaService.favorite.create({
            data: {
                subject: model.favoritableSubject(),
                id: model.id(),
                created_at: model.createdAt(),
                spot_id: model.favoritableSubject() === FavoritableSubject.SPOT ? model.favoritable().id() : null,
                spot_event_id: model.favoritableSubject() === FavoritableSubject.SPOT_EVENT ? model.favoritable().id() : null,
                spot_folder_id: model.favoritableSubject() === FavoritableSubject.SPOT_FOLDER ? model.favoritable().id() : null,
                user_id: model.user().id(),
            },
            include: this._mountInclude(),
        });

        return this._favoriteEntityMapper.toModel(favorite);
    }
    
    public async update(model: Favorite): Promise<void> {
        await this.prismaService.favorite.update({
            where: {
                id: model.id(),
            },
            data: {
                subject: model.favoritableSubject(),
                created_at: model.createdAt(),
                spot_id: model.favoritableSubject() === FavoritableSubject.SPOT ? model.favoritable().id() : null,
                spot_event_id: model.favoritableSubject() === FavoritableSubject.SPOT_EVENT ? model.favoritable().id() : null,
                spot_folder_id: model.favoritableSubject() === FavoritableSubject.SPOT_FOLDER ? model.favoritable().id() : null,
                user_id: model.user().id(),
            },
            include: this._mountInclude(),
        });
    }
    
    public async delete(id: string): Promise<void> {
        await this.prismaService.favorite.delete({
            where: {
                id: id,
            },
        });
    }
}
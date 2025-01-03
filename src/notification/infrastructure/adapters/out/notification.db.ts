import { Inject, Injectable } from "@nestjs/common";
import { CacheableRepository } from "src/cache/cacheable.repository";
import { RedisService } from "src/cache/redis.service";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { NotificationRepository } from "src/notification/application/ports/out/notification.repository";
import { Notification } from "src/notification/domain/notification.model";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationEntityMapper } from "./mappers/notification-entity.mapper";

@Injectable()
export class NotificationRepositoryImpl extends CacheableRepository implements NotificationRepository {
    private _notificationEntityMapper: NotificationEntityMapper = new NotificationEntityMapper();

    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService,
        @Inject(RedisService)
        protected redisService: RedisService,
    ) {super(redisService)}

    private _mountQuery(values: Object): Object {
        const status = values['status'];
        const type = values['type'];
        const userId = values['userId'];

        const query = {};

        if (status) query['status'] = status;

        if (type) query['type'] = type;

        if (userId) query['user_id'] = userId;

        return query;
    }

    private _mountInclude(): Object {
        return {
            user: {
                include: {
                    profile: true,
                    credentials: true,
                    visibility_settings: true,
                }
            }
        };
    }
    
    public async paginate(params: PaginateParameters): Promise<Pagination<Notification>> {
        const key = `notification:paginate:${JSON.stringify(params)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return new Pagination(
                cachedData.items.map(i => this._notificationEntityMapper.toModel(i)),
                cachedData.total,
                cachedData.current_page,
                cachedData.limit
            );
        }

        const query = this._mountQuery(params.filters);
        const sort = params.sort ?? 'created_at';
        const sortDirection = params.sortDirection ?? SortDirection.DESC;

        let orderBy = {};

        switch(sort) {
            case 'created_at':
            case 'createdAt':
            default:
                orderBy = {
                    created_at: sortDirection,
                };
                break;
        }

        const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

        let items = [];

        if (paginate) {
            items = await this.prismaService.notification.findMany({
                where: query,
                include: this._mountInclude(),
                orderBy: [
                    {
                        status: 'desc'
                    },
                    orderBy,
                ],
                skip: page * limit,
                take: limit,
            });
        } else {
            items = await this.prismaService.notification.findMany({
                where: query,
                include: this._mountInclude(),
                orderBy: [
                    {
                        status: 'desc'
                    },
                    orderBy,
                ],
            });
        }

        await this._setCachedData(key, new Pagination(items, total,page + 1, limit));

        return new Pagination(items.map(i => this._notificationEntityMapper.toModel(i)), total, page + 1, limit);
    }
    
    public async findBy(values: Object): Promise<Notification[]> {
        const key = `notification:findBy:${JSON.stringify(values)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData.map(i => this._notificationEntityMapper.toModel(i));
        }

        const query = this._mountQuery(values);
        const items = await this.prismaService.notification.findMany({
            where: query,
            include: this._mountInclude(),
        });

        await this._setCachedData(key, items);

        return items.map(i => this._notificationEntityMapper.toModel(i));
    }
    
    public async countBy(values: Object): Promise<number> {
        const key = `notification:countBy:${JSON.stringify(values)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData;
        }

        const query = this._mountQuery(values);
        const count = await this.prismaService.notification.count({
            where: query,
        });
        
        return count;
    }
    
    public async findById(id: string): Promise<Notification> {
        const key = `notification:findById:${id}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return this._notificationEntityMapper.toModel(cachedData);
        }

        const item = await this.prismaService.notification.findFirst({
            where: {
                id: id,
            },
            include: this._mountInclude(),
        });

        await this._setCachedData(key, item);

        return this._notificationEntityMapper.toModel(item);
    }
    
    public async findAll(): Promise<Notification[]> {
        const key = `notification:findAll`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData.map(i => this._notificationEntityMapper.toModel(i));
        }

        const items = await this.prismaService.notification.findMany({
            include: this._mountInclude(),
        });

        await this._setCachedData(key, items);

        return items.map(i => this._notificationEntityMapper.toModel(i));
    }
    
    public async store(model: Notification): Promise<Notification> {
        const notification = await this.prismaService.notification.create({
            data: {
                id: model.id(),
                title: model.title(),
                content: model.content(),
                status: model.status(),
                type: model.type(),
                created_at: model.createdAt(),
                read_at: model.readAt(),
                user_id: model.user().id(),
                payload: {
                    subject: model.payload().subject,
                    subject_id: model.payload().subject_id,
                    extra_data: model.payload().extra_data,
                },
            }
        });

        return this._notificationEntityMapper.toModel(notification);
    }
    
    public async update(model: Notification): Promise<void> {
        await this.prismaService.notification.update({
            where: {
                id: model.id(),
            },
            data: {
                status: model.status(),
                read_at: model.readAt(),
            }
        });
    }
    
    public async delete(id: string): Promise<void> {
        await this.prismaService.notification.delete({
            where: {
                id: id,
            }
        });
    }


}
import { Inject, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { env } from "process";
import { RedisService } from "src/cache/redis.service";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PrismaService } from "src/prisma/prisma.service";
import { SpotEventRepository } from "src/spot-event/application/ports/out/spot-event.repository";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotEventEntityMapper } from "./mappers/spot-event-entity.mapper";

const REDIS_DB_TTL = env.REDIS_DB_TTL;

@Injectable()
export class SpotEventRepositoryImpl implements SpotEventRepository {
    private _spotEventEntityMapper: SpotEventEntityMapper = new SpotEventEntityMapper();

    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService,
        @Inject(RedisService)
        protected redisService: RedisService,
    ) {}

	private async _getCachedData(key: string): Promise<any> {
		const data = await this.redisService.get(key);
		
		if (data) return JSON.parse(data, (key, value) => {
			const valid = moment(value, moment.ISO_8601, true).isValid();

			if (valid) return moment(value);
		});

		return null;
	}

	private async _setCachedData(key: string, data: any): Promise<void> {
		await this.redisService.set(key, JSON.stringify(data), "EX", REDIS_DB_TTL);
	}

    private _mountQuery(values: Object): Object {
        const spotId = values['spotId'];
        const groupId = values['groupId'];
        const status = values['status'];
        const startDate = values['startDate'];
        const endDate = values['endDate'];

        let query = {};

        if (spotId) {
            query['spot_id'] = spotId;
        }

        if (groupId) {
            query['group_id'] = groupId;
        }

        if (status) {
            query['status'] = status;
        }

        if (startDate) {
            query['start_date'] = {
                gte: startDate,
            };
        }

        if (endDate) {
            query['end_date'] = {
                lte: endDate,
            };
        }

        return query;
    }

    private _mountInclude(): Object {
        return {
            spot: true,
            participants: {
                include: {
                    user: {
                        include: {
                            profile: true,
                            visibility_settings: true,
                            credentials: true,
                        }
                    }
                }
            },
            group: {
                include: {
                    visibility_settings: true,
                }
            },
            creator: {
                include: {
                    profile: true,
                    visibility_settings: true,
                    credentials: true,
                }
            }
        };
    }

    public async paginate(params: PaginateParameters): Promise<Pagination<SpotEvent>> {
        const key = `spot-event:paginate:${JSON.stringify(params)}`;
        const cachedKey = await this._getCachedData(key);

        if (cachedKey) {
            return new Pagination(
                cachedKey.items.map((i) => {
                    return this._spotEventEntityMapper.toModel(i);
                }),
                cachedKey.total,
                cachedKey.curent_page,
                cachedKey.limit
            );
        }

        const query = this._mountQuery(params.filters);
        const sort = params.sort ?? 'created_at';
        const sortDirection = params.sortDirection ?? SortDirection.DESC;

        let orderBy = {};

        switch (sort) {
            case 'startDate':
            case 'start_date':
                orderBy = { start_date: sortDirection };
                break;
            case 'endDate':
            case 'end_date':
                orderBy = { end_date: sortDirection };
                break;
            case 'name':
                orderBy = { name: sortDirection };
                break;
            case 'updatedAt':
            case 'updated_at':
                orderBy = { updated_at: sortDirection };
                break;
            case 'createdAt':
            case 'created_at':
            default:
                orderBy = { created_at: sortDirection };
                break;
        }
        
        let items = [];

        const paginate = params.paginate ?? false;
        const page = (params.page ?? 1) - 1;
        const limit = params.limit ?? 12;
        const total = await this.countBy(params.filters);

        if (paginate) {
            items = await this.prismaService.spotEvent.findMany({
                where: query,
                orderBy: orderBy,
                include: this._mountInclude(),
                skip: limit * page,
                take: limit,
            });
        } else {
            items = await this.prismaService.spotEvent.findMany({
                where: query,
                orderBy: orderBy,
                include: this._mountInclude(),
            });
        }

        await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

        items = items.map((i) => {
            return this._spotEventEntityMapper.toModel(i);
        });

        return new Pagination(items, total, page + 1, limit);
    }

    public async findBy(values: Object): Promise<Array<SpotEvent>> {
        const key = `spot-event:findBy:${JSON.stringify(values)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData.map((i) => {
                return this._spotEventEntityMapper.toModel(i);
            });
        }

        const query = this._mountQuery(values);

        const items = await this.prismaService.spotEvent.findMany({
            where: query,
            include: this._mountInclude(),
        });

        await this._setCachedData(key, items);

        return items.map((i) => {
            return this._spotEventEntityMapper.toModel(i);
        });
    }

    public async countBy(values: Object): Promise<number> {
        const key = `spot-event:countBy:${JSON.stringify(values)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData;
        }

        const query = this._mountQuery(values);

        const count = await this.prismaService.spotEvent.count({
            where: query,
        });

        await this._setCachedData(key, count);
        
        return count;
    }

    public async findAll(): Promise<SpotEvent[]> {
        const key = 'spot-event:findAll';
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData.map((i) => {
                return this._spotEventEntityMapper.toModel(i);
            });
        }

        const items = await this.prismaService.spotEvent.findMany({
            include: this._mountInclude(),
        });

        await this._setCachedData(key, items);

        return items.map((i) => {
            return this._spotEventEntityMapper.toModel(i);
        }); 
    }

    public async findById(id: string): Promise<SpotEvent> {
        const key = `spot-event:findById:${id}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return this._spotEventEntityMapper.toModel(cachedData);
        }

        const item = await this.prismaService.spotEvent.findUnique({
            where: {
                id: id,
            },
            include: this._mountInclude(),
        });

        await this._setCachedData(key, item);

        return this._spotEventEntityMapper.toModel(item);
    }

    public async store(spotEvent: SpotEvent): Promise<SpotEvent> {
        const event = await this.prismaService.spotEvent.create({
            data: {
                id: spotEvent.id(),
                name: spotEvent.name(),
                description: spotEvent.description(),
                start_date: spotEvent.startDate(),
                end_date: spotEvent.endDate(),
                status: spotEvent.status(),
                visibility: spotEvent.visibility(),
                created_at: spotEvent.createdAt(),
                group_id: spotEvent.group().id(),
                spot_id: spotEvent.spot().id(),
                updated_at: spotEvent.updatedAt(),
                user_id: spotEvent.creator().id(),
            }
        });

        return this._spotEventEntityMapper.toModel(event);
    }

    public async update(spotEvent: SpotEvent): Promise<void> {
        await this.prismaService.spotEvent.update({
            where: {
                id: spotEvent.id(),
            },
            data: {
                name: spotEvent.name(),
                description: spotEvent.description(),
                start_date: spotEvent.startDate(),
                end_date: spotEvent.endDate(),
                status: spotEvent.status(),
                visibility: spotEvent.visibility(),
                updated_at: spotEvent.updatedAt(),
            }
        });

        await this.prismaService.spotEventParticipant.deleteMany({
            where: {
                spot_event_id: spotEvent.id(),
            }
        });

        for (const participant of spotEvent.participants()) {
            await this.prismaService.spotEventParticipant.create({
                data: {
                    user_id: participant.user().id(),
                    spot_event_id: spotEvent.id(),
                    participated_at: participant.participatedAt(),
                }
            });
        }
    }

    public async delete(id: string): Promise<void> {
        await this.prismaService.spotEvent.delete({
            where: {
                id: id,
            },
        });
    }
}
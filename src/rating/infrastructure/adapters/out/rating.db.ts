import { Inject, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { env } from "process";
import { RedisService } from "src/cache/redis.service";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PrismaService } from "src/prisma/prisma.service";
import { RatingRepository } from "src/rating/application/ports/out/rating.repository";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";
import { Rating } from "src/rating/domain/rating.model";
import { RatingEntityMapper } from "./mappers/rating-entity.mapper";

const REDIS_DB_TTL = env.REDIS_DB_TTL;

@Injectable()
export class RatingRepositoryImpl implements RatingRepository {
    private _ratingEntityMapper: RatingEntityMapper = new RatingEntityMapper();

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
        const subject = values["subject"];
        const userId = values["userId"];
        const subjectId = values["subjectId"];
        const value = values["value"];

        const query = {};

        if (subject) {
            query["subject"] = subject;
        }

        if (userId) {
            query["userId"] = userId;
        }

        if (subjectId) {
            query["subjectId"] = subjectId;
        }

        if (value) {
            query["value"] = value;
        }

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

    public async paginate(params: PaginateParameters): Promise<Pagination<Rating>> {
        const key = `rating:paginate:${JSON.stringify(params)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return new Pagination(
                cachedData.data.map((entity: any) => this._ratingEntityMapper.toModel(entity)),
                cachedData.total,
                cachedData.page,
                cachedData.limit,
            );
        }

        const query = this._mountQuery(params.filters);
        const sort = params.sort ?? 'created_at';
        const sortDirection = params.sortDirection ?? SortDirection.DESC;

        let orderBy = {};

        switch (sort) {
            case 'value':
                orderBy = { value: sortDirection };
                break;
            case 'created_at':
            case 'createdAt':
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
            items = await this.prismaService.rating.findMany({
                where: query,
                orderBy: orderBy,
                include: this._mountInclude(),
                skip: page * limit,
                take: limit,
            });
        } else {
            items = await this.prismaService.rating.findMany({
                where: query,
                orderBy: orderBy,
                include: this._mountInclude(),
            });
        }

        await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

        items = items.map((entity: any) => this._ratingEntityMapper.toModel(entity));

        return new Pagination(items, total, page + 1, limit);
    }


    public async findBy(values: Object): Promise<Rating[]> {
        const key = `rating:findBy:${JSON.stringify(values)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData.map((entity: any) => this._ratingEntityMapper.toModel(entity));
        }

        const query = this._mountQuery(values);
        const items = await this.prismaService.rating.findMany({
            where: query,
            include: this._mountInclude(),
        });

        await this._setCachedData(key, items);

        return items.map((entity: any) => this._ratingEntityMapper.toModel(entity));
    }


    public async countBy(values: Object): Promise<number> {
        const key = `rating:countBy:${JSON.stringify(values)}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData;
        }

        const query = this._mountQuery(values);

        const total = await this.prismaService.rating.count({
            where: query,
        });

        await this._setCachedData(key, total);

        return total;
    }


    public async findById(id: string): Promise<Rating> {
        const key = `rating:findById:${id}`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return this._ratingEntityMapper.toModel(cachedData);
        }

        const item = await this.prismaService.rating.findUnique({
            where: { id },
            include: this._mountInclude(),
        });

        await this._setCachedData(key, item);

        return this._ratingEntityMapper.toModel(item);
    }


    public async findAll(): Promise<Rating[]> {
        const key = `rating:findAll`;
        const cachedData = await this._getCachedData(key);

        if (cachedData) {
            return cachedData.map((entity: any) => this._ratingEntityMapper.toModel(entity));
        }

        const items = await this.prismaService.rating.findMany({
            include: this._mountInclude(),
        });

        await this._setCachedData(key, items);

        return items.map((entity: any) => this._ratingEntityMapper.toModel(entity));
    }


    public async store(model: Rating): Promise<Rating> {
        const rating = await this.prismaService.rating.create({
            data: {
                id: model.id(),
                value: model.value(),
                comment: model.comment(),
                created_at: model.createdAt(),
                updated_at: model.updatedAt(),
                user_id: model.user().id(),
                spot_id: model.subject() === RatableSubject.SPOT ? model.subjectId() : null,
                spot_event_id: model.subject() === RatableSubject.SPOT_EVENT ? model.subjectId() : null,
                spot_folder_id: model.subject() === RatableSubject.SPOT_FOLDER ? model.subjectId() : null,
            },
            include: this._mountInclude(),
        });

        return this._ratingEntityMapper.toModel(rating);
    }


    public async update(model: Rating): Promise<void> {
        await this.prismaService.rating.update({
            where: { id: model.id() },
            data: {
                value: model.value(),
                comment: model.comment(),
                updated_at: model.updatedAt(),
            },
        });
    }


    public async delete(id: string): Promise<void> {
        await this.prismaService.rating.delete({
            where: { id },
        });
    }

} 
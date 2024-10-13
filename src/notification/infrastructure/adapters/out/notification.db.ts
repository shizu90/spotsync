import { Inject, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { RedisService } from "src/cache/redis.service";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { NotificationRepository } from "src/notification/application/ports/out/notification.repository";
import { Notification } from "src/notification/domain/notification.model";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationEntityMapper } from "./mappers/notification-entity.mapper";

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
    private _notificationEntityMapper: NotificationEntityMapper = new NotificationEntityMapper();

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

	private async _setCachedData(key: string, data: any, ttl: number): Promise<void> {
		await this.redisService.set(key, JSON.stringify(data), "EX", ttl);
	}
    
    public async paginate(params: PaginateParameters): Promise<Pagination<Notification>> {
        throw new Error("Method not implemented.");
    }
    
    public async findBy(values: Object): Promise<Notification[]> {
        throw new Error("Method not implemented.");
    }
    
    public async countBy(values: Object): Promise<number> {
        throw new Error("Method not implemented.");
    }
    
    public async findById(id: string): Promise<Notification> {
        throw new Error("Method not implemented.");
    }
    
    public async findAll(): Promise<Notification[]> {
        throw new Error("Method not implemented.");
    }
    
    public async store(model: Notification): Promise<Notification> {
        throw new Error("Method not implemented.");
    }
    
    public async update(model: Notification): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    public async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }


}
import * as moment from "moment";
import { env } from "process";
import { RedisService } from "./redis.service";

const REDIS_DB_TTL = env.REDIS_DB_TTL;

export abstract class CacheableRepository {
    constructor(
        protected redisService: RedisService,
    ) {}

    protected async _getCachedData(key: string): Promise<any> {
		const data = await this.redisService.get(key);
		
		if (data) return JSON.parse(data, (key, value) => {
			const valid = moment(value, moment.ISO_8601, true).isValid();

			if (valid) return moment(value);
		});

		return null;
	}

	protected async _setCachedData(key: string, data: any): Promise<void> {
		await this.redisService.set(key, JSON.stringify(data), "EX", REDIS_DB_TTL);
	}
}
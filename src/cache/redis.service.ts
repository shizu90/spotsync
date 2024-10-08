import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { env } from 'process';

@Injectable()
export class RedisService extends Redis {
    constructor() {
        super(
            parseInt(env.REDIS_PORT),
            env.REDIS_HOST,
        );
    }
}
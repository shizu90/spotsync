import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	public async onModuleInit() {
		await this.$connect();
	}

	public async enableShutdownHooks(app: INestApplication) {
		await app.close();
	}
}

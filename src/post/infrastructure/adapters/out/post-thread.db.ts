import { Inject } from '@nestjs/common';
import { PaginateParameters, Pagination } from 'src/common/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PostThreadRepository } from 'src/post/application/ports/out/post-thread.repository';
import { PostThread } from 'src/post/domain/post-thread.model';
import { PrismaService } from 'src/prisma/prisma.service';

export class PostThreadRepositoryImpl implements PostThreadRepository {
	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	private mapThreadToDomain(prisma_model: any): PostThread {
		if (prisma_model === undefined || prisma_model === null) return null;

		return PostThread.create(
			prisma_model.id,
			prisma_model.max_depth_level,
			prisma_model.created_at,
		);
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<PostThread>> {
		let query = `SELECT id FROM post_thread`;

		if (params.filters) {
			if (typeof params.filters['maxDepthLevel'] === 'number') {
				const maxDepthLevel = params.filters['maxDepthLevel'];
				if (query.includes('WHERE')) {
					query = `${query} AND max_depth_level = ${maxDepthLevel}`;
				} else {
					query = `${query} WHERE max_depth_level = ${maxDepthLevel}`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const sort = params.sort ?? 'created_at';
		const sortDirection = params.sortDirection ?? SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'max_depth_level':
			case 'maxDepthLevel':
				orderBy = { max_depth_level: sortDirection };
				break;
			case 'created_at':
			case 'createdAt':
			default:
				orderBy = { created_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = params.page ?? 0;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.postThread.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.postThread.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
			});
		}

		return new Pagination<PostThread>(items, total, page);
	}

	public async findBy(values: Object): Promise<PostThread[]> {
		const maxDepthLevel = values['maxDepthLevel'] ?? null;

		let query = {};

		if (maxDepthLevel !== null) {
			query['max_depth_level'] = maxDepthLevel;
		}

		const threads = await this.prismaService.postThread.findMany({
			where: query,
		});

		return threads.map((thread) => this.mapThreadToDomain(thread));
	}

	public async countBy(values: Object): Promise<number> {
		const maxDepthLevel = values['maxDepthLevel'] ?? null;

		let query = {};

		if (maxDepthLevel !== null) {
			query['max_depth_level'] = maxDepthLevel;
		}

		const count = await this.prismaService.postThread.count({
			where: query,
		});

		return count;
	}

	public async findAll(): Promise<PostThread[]> {
		const threads = await this.prismaService.postThread.findMany();

		return threads.map((thread) => this.mapThreadToDomain(thread));
	}

	public async findById(id: string): Promise<PostThread> {
		const thread = await this.prismaService.postThread.findFirst({
			where: { id: id },
		});

		return this.mapThreadToDomain(thread);
	}

	public async store(model: PostThread): Promise<PostThread> {
		const thread = await this.prismaService.postThread.create({
			data: {
				id: model.id(),
				max_depth_level: model.maxDepthLevel(),
			},
		});

		return this.mapThreadToDomain(thread);
	}

	public async update(model: PostThread): Promise<void> {
		const thread = await this.prismaService.postThread.update({
			data: {
				max_depth_level: model.maxDepthLevel(),
			},
			where: {
				id: model.id(),
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.postThread.delete({
			where: { id: id },
		});
	}
}

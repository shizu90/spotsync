import { Inject } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PostThreadRepository } from 'src/post/application/ports/out/post-thread.repository';
import { PostThread } from 'src/post/domain/post-thread.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostThreadEntityMapper } from './mappers/post-thread-entity.mapper';

export class PostThreadRepositoryImpl implements PostThreadRepository {
	private _postThreadEntityMapper: PostThreadEntityMapper = new PostThreadEntityMapper();
	
	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

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
		const page = (params.page ?? 1)-1;
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

		items = items.map((thread) => this._postThreadEntityMapper.toModel(thread));

		return new Pagination<PostThread>(items, total, page+1, limit);
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

		return threads.map((thread) => this._postThreadEntityMapper.toModel(thread));
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

		return threads.map((thread) => this._postThreadEntityMapper.toModel(thread));
	}

	public async findById(id: string): Promise<PostThread> {
		const thread = await this.prismaService.postThread.findFirst({
			where: { id: id },
		});

		return this._postThreadEntityMapper.toModel(thread);
	}

	public async store(model: PostThread): Promise<PostThread> {
		const thread = await this.prismaService.postThread.create({
			data: {
				id: model.id(),
				max_depth_level: model.maxDepthLevel(),
			},
		});

		return this._postThreadEntityMapper.toModel(thread);
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

import { Inject } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { FollowRepository } from 'src/follower/application/ports/out/follow.repository';
import { Follow } from 'src/follower/domain/follow.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowEntityMapper } from './mappers/follow-entity.mapper';

export class FollowRepositoryImpl implements FollowRepository {
	private _followEntityMapper: FollowEntityMapper = new FollowEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Follow>> {
		let query = `SELECT id FROM follows`;

		if (params.filters) {
			if (typeof params.filters['status'] === 'string') {
				const status = params.filters['status'];
				if (query.includes('WHERE')) {
					query = `${query} AND status = '${status}'`;
				} else {
					query = `${query} WHERE status = '${status}'`;
				}
			}

			if (typeof params.filters['fromUserId'] === 'string') {
				const fromUserId = params.filters['fromUserId'];
				if (query.includes('WHERE')) {
					query = `${query} AND from_user_id = '${fromUserId}'`;
				} else {
					query = `${query} WHERE from_user_id = '${fromUserId}'`;
				}
			}

			if (typeof params.filters['toUserId'] === 'string') {
				const toUserId = params.filters['toUserId'];
				if (query.includes('WHERE')) {
					query = `${query} AND to_user_id = '${toUserId}'`;
				} else {
					query = `${query} WHERE to_user_id = '${toUserId}'`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const sort = params.sort ?? 'followedAt';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'followed_at':
			case 'followedAt':
			default:
				orderBy = {
					followed_at: sortDirection,
				};
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1)-1;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.follow.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					from_user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
					to_user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
				},
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.follow.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					from_user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
					to_user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
				},
			});
		}

		items = items.map((i) => {
			return this._followEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<Array<Follow>> {
		const status = values['status'];
		const fromUserId = values['fromUserId'];
		const toUserId = values['toUserId'];

		let query = 'SELECT id FROM follows';

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND status = '${status}'`;
			} else {
				query = `${query} WHERE status = '${status}'`;
			}
		}

		if (fromUserId) {
			if (query.includes('WHERE')) {
				query = `${query} AND from_user_id = '${fromUserId}'`;
			} else {
				query = `${query} WHERE from_user_id = '${fromUserId}'`;
			}
		}

		if (toUserId) {
			if (query.includes('WHERE')) {
				query = `${query} AND to_user_id = '${toUserId}'`;
			} else {
				query = `${query} WHERE to_user_id = '${toUserId}'`;
			}
		}

		const followIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const follows = await this.prismaService.follow.findMany({
			where: {
				id: { in: followIds.map((row) => row.id) },
			},
			include: {
				from_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				to_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return follows.map((follow) => {
			return this._followEntityMapper.toModel(follow);
		});
	}

	public async countBy(values: Object) {
		const status = values['status'];
		const fromUserId = values['fromUserId'];
		const toUserId = values['toUserId'];

		let query = 'SELECT id FROM follows';

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND status = '${status}'`;
			} else {
				query = `${query} WHERE status = '${status}'`;
			}
		}

		if (fromUserId) {
			if (query.includes('WHERE')) {
				query = `${query} AND from_user_id = '${fromUserId}'`;
			} else {
				query = `${query} WHERE from_user_id = '${fromUserId}'`;
			}
		}

		if (toUserId) {
			if (query.includes('WHERE')) {
				query = `${query} AND to_user_id = '${toUserId}'`;
			} else {
				query = `${query} WHERE to_user_id = '${toUserId}'`;
			}
		}

		const followIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const count = await this.prismaService.follow.count({
			where: { id: { in: followIds.map((row) => row.id) } },
		});

		return count;
	}

	public async findAll(): Promise<Array<Follow>> {
		const follows = await this.prismaService.follow.findMany({
			include: {
				from_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				to_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return follows.map((follow) => {
			return this._followEntityMapper.toModel(follow);
		});
	}

	public async findById(id: string): Promise<Follow> {
		const follow = await this.prismaService.follow.findFirst({
			where: {
				id: id,
			},
			include: {
				from_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				to_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return this._followEntityMapper.toModel(follow);
	}

	public async store(model: Follow): Promise<Follow> {
		const follow = await this.prismaService.follow.create({
			data: {
				id: model.id(),
				from_user_id: model.from().id(),
				to_user_id: model.to().id(),
				followed_at: model.followedAt(),
				status: model.status(),
				requested_at: model.requestedAt(),
			},
			include: {
				from_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				to_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return this._followEntityMapper.toModel(follow);
	}

	public async update(model: Follow): Promise<void> {
		await this.prismaService.follow.update({
			where: { id: model.id() },
			data: {
				from_user_id: model.from().id(),
				to_user_id: model.to().id(),
				followed_at: model.followedAt(),
				status: model.status(),
				requested_at: model.requestedAt(),
			},
			include: {
				from_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				to_user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.follow.delete({
			where: {
				id: id,
			},
		});
	}
}

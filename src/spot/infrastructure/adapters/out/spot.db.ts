import { Inject, Injectable } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotRepository } from 'src/spot/application/ports/out/spot.repository';
import { Spot } from 'src/spot/domain/spot.model';
import { VisitedSpot } from 'src/spot/domain/visited-spot.model';
import { SpotEntityMapper } from './mappers/spot-entity.mapper';
import { VisitedSpotEntityMapper } from './mappers/visited-spot-entity.mapper';

@Injectable()
export class SpotRepositoryImpl implements SpotRepository {
	private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();
	private _visitedSpotEntityMapper: VisitedSpotEntityMapper = new VisitedSpotEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Spot>> {
		let query = `SELECT spots.id FROM spots`;

		if (params.filters) {
			if (typeof params.filters['favoritedById'] === 'string') {
				const favoritedById = params.filters['favoritedById'];
				query = `${query} INNER JOIN favorited_spots ON spots.id = favorited_spots.spot_id AND favorited_spots.user_id = '${favoritedById}'`;
			}

			if (typeof params.filters['visitedById'] === 'string') {
				const visitedById = params.filters['visitedById'];
				query = `${query} INNER JOIN visited_spots ON spots.id = visited_spots.spot_id AND visited_spots.user_id = '${visitedById}'`;
			}

			if (typeof params.filters['name'] === 'string') {
				const name = params.filters['name'];
				if (query.includes('WHERE')) {
					query = `${query} AND name ILIKE '%${name}%'`;
				} else {
					query = `${query} WHERE name ILIKE '%${name}%'`;
				}
			}

			if (typeof params.filters['type'] === 'string') {
				const type = params.filters['type'];
				if (query.includes('WHERE')) {
					query = `${query} AND type = '${type}'`;
				} else {
					query = `${query} WHERE type = '${type}'`;
				}
			}

			if (typeof params.filters['creatorId'] === 'string') {
				const creatorId = params.filters['creatorId'];
				if (query.includes('WHERE')) {
					query = `${query} AND creator_id = '${creatorId}'`;
				} else {
					query = `${query} WHERE creator_id = '${creatorId}'`;
				}
			}

			if (typeof params.filters['isDeleted'] === 'boolean') {
				const isDeleted = params.filters['isDeleted'];
				if (query.includes('WHERE')) {
					query = `${query} AND is_deleted = ${isDeleted}`;
				} else {
					query = `${query} WHERE is_deleted = ${isDeleted}`;
				}
			}

			if (typeof params.filters['spotId'] === 'string') {
				const spotId = params.filters['spotId'];
				if (query.includes('WHERE')) {
					query = `${query} AND spots.id = '${spotId}'`;
				} else {
					query = `${query} WHERE spots.id = '${spotId}'`;
				}
			}

			const ids =
				await this.prismaService.$queryRawUnsafe<{ id: string }[]>(
					query,
				);

			const sort = params.sort ?? 'created_at';
			const sortDirection = params.sortDirection ?? SortDirection.DESC;

			let orderBy = {};

			switch (sort) {
				case 'name':
					orderBy = { name: sortDirection };
					break;
				case 'type':
					orderBy = { type: sortDirection };
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
			const page = (params.page ?? 1)-1;
			const limit = params.limit ?? 12;
			const total = ids.length;

			if (paginate) {
				items = await this.prismaService.spot.findMany({
					where: { id: { in: ids.map((row) => row.id) } },
					orderBy: orderBy,
					include: {
						address: true,
						photos: true,
						creator: {
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
				items = await this.prismaService.spot.findMany({
					where: { id: { in: ids.map((row) => row.id) } },
					orderBy: orderBy,
					include: {
						address: true,
						photos: true,
						creator: {
							include: {
								credentials: true,
								visibility_settings: true,
								profile: true,
							},
						},
					},
				});
			}

			return new Pagination(
				items.map((s) => this._spotEntityMapper.toModel(s)),
				total,
				page+1,
				limit,
			);
		}
	}

	public async findByName(name: string): Promise<Spot> {
		let query = `SELECT spots.id FROM spots WHERE lower(name) = lower('${name}');`;

		const id = await this.prismaService.$queryRawUnsafe<{ id: string }>(
			query,
		);

		const spot = await this.prismaService.spot.findFirst({
			where: { id: id.id },
			include: {
				address: true,
				photos: true,
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
			},
		});

		return this._spotEntityMapper.toModel(spot);
	}

	public async findBy(values: Object): Promise<Spot[]> {
		const name = values['name'] ?? null;
		const type = values['type'] ?? null;
		const creatorId = values['creatorId'] ?? null;
		const isDeleted = values['isDeleted'] ?? null;
		const favoritedById = values['favoritedById'] ?? null;
		const visitedById = values['visitedById'] ?? null;
		const spotId = values['spotId'] ?? null;

		let query = `SELECT spots.id FROM spots`;

		if (favoritedById !== null) {
			query = `${query} INNER JOIN favorited_spots ON spots.id = favorited_spots.spot_id AND favorited_spots.user_id = '${favoritedById}'`;
		}

		if (visitedById !== null) {
			query = `${query} INNER JOIN visited_spots ON spots.id = visited_spots.spot_id AND visited_spots.user_id = '${visitedById}'`;
		}

		if (name !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND name ILIKE '%${name}%'`;
			} else {
				query = `${query} WHERE name ILIKE '%${name}%'`;
			}
		}

		if (type !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND type = '${type}'`;
			} else {
				query = `${query} WHERE type = '${type}'`;
			}
		}

		if (creatorId !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND creator_id = '${creatorId}'`;
			} else {
				query = `${query} WHERE creator_id = '${creatorId}'`;
			}
		}

		if (isDeleted !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND is_deleted = ${isDeleted}`;
			} else {
				query = `${query} WHERE is_deleted = ${isDeleted}`;
			}
		}

		if (spotId !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND spots.id = '${spotId}'`;
			} else {
				query = `${query} WHERE spots.id = '${spotId}'`;
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const spots = await this.prismaService.spot.findMany({
			where: { id: { in: ids.map((row) => row.id) } },
			include: {
				address: true,
				photos: true,
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
			},
		});

		return spots.map((s) => this._spotEntityMapper.toModel(s));
	}

	public async findVisitedSpotBy(
		values: Object,
	): Promise<Array<VisitedSpot>> {
		const spotId = values['spotId'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (spotId !== null) {
			query['spot_id'] = spotId;
		}

		if (userId !== null) {
			query['user_id'] = userId;
		}

		const visitedSpots = await this.prismaService.visitedSpot.findMany({
			where: query,
			include: {
				spot: {
					include: {
						address: true,
						photos: true,
						creator: {
							include: {
								credentials: true,
								visibility_settings: true,
								profile: true,
							},
						},
					},
				},
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
			},
		});

		return visitedSpots.map((vs) => this._visitedSpotEntityMapper.toModel(vs));
	}

	public async countBy(values: Object): Promise<number> {
		const name = values['name'] ?? null;
		const type = values['type'] ?? null;
		const creatorId = values['creatorId'] ?? null;
		const isDeleted = values['isDeleted'] ?? null;
		const favoritedById = values['favoritedById'] ?? null;
		const visitedById = values['visitedById'] ?? null;
		const spotId = values['spotId'] ?? null;

		let query = `SELECT count(spots.id) FROM spots`;

		if (favoritedById !== null) {
			query = `${query} INNER JOIN favorited_spots ON spots.id = favorited_spots.spot_id AND favorited_spots.user_id = '${favoritedById}'`;
		}

		if (visitedById !== null) {
			query = `${query} INNER JOIN visited_spots ON spots.id = visited_spots.spot_id AND visited_spots.user_id = '${visitedById}'`;
		}

		if (name !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND name ILIKE '%${name}%'`;
			} else {
				query = `${query} WHERE name ILIKE '%${name}%'`;
			}
		}

		if (type !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND type = '${type}'`;
			} else {
				query = `${query} WHERE type = '${type}'`;
			}
		}

		if (creatorId !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND creator_id = '${creatorId}'`;
			} else {
				query = `${query} WHERE creator_id = '${creatorId}'`;
			}
		}

		if (isDeleted !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND is_deleted = ${isDeleted}`;
			} else {
				query = `${query} WHERE is_deleted = ${isDeleted}`;
			}
		}

		if (spotId !== null) {
			if (query.includes('WHERE')) {
				query = `${query} AND spots.id = '${spotId}'`;
			} else {
				query = `${query} WHERE spots.id = '${spotId}'`;
			}
		}

		const count = await this.prismaService.$queryRawUnsafe<{
			count: number;
		}>(query);

		return count.count;
	}

	public async countVisitedSpotBy(values: Object): Promise<number> {
		const spotId = values['spotId'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (spotId !== null) {
			query['spot_id'] = spotId;
		}

		if (userId !== null) {
			query['user_id'] = userId;
		}

		const count = await this.prismaService.visitedSpot.count({
			where: query,
		});

		return count;
	}

	public async findAll(): Promise<Spot[]> {
		const spots = await this.prismaService.spot.findMany({
			include: {
				address: true,
				photos: true,
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
			},
		});

		return spots.map((s) => this._spotEntityMapper.toModel(s));
	}

	public async findById(id: string): Promise<Spot> {
		const spot = await this.prismaService.spot.findFirst({
			where: { id: id },
			include: {
				address: true,
				photos: true,
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
			},
		});

		return this._spotEntityMapper.toModel(spot);
	}

	public async store(model: Spot): Promise<Spot> {
		const spot = await this.prismaService.spot.create({
			data: {
				id: model.id(),
				name: model.name(),
				description: model.description(),
				type: model.type(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				creator_id: model.creator().id(),
				is_deleted: model.isDeleted(),
				address: {
					create: {
						area: model.address().area(),
						sub_area: model.address().subArea(),
						longitude: model.address().longitude(),
						latitude: model.address().latitude(),
						locality: model.address().locality(),
						country_code: model.address().countryCode(),
					},
				},
			},
			include: {
				address: true,
				photos: true,
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
			},
		});

		return this._spotEntityMapper.toModel(spot);
	}

	public async storeVisitedSpot(model: VisitedSpot): Promise<VisitedSpot> {
		const visitedSpot = await this.prismaService.visitedSpot.create({
			data: {
				id: model.id(),
				spot_id: model.spot().id(),
				user_id: model.user().id(),
				visited_at: model.visitedAt(),
			},
			include: {
				spot: {
					include: {
						address: true,
						photos: true,
					},
				},
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
			},
		});

		return this._visitedSpotEntityMapper.toModel(visitedSpot);
	}

	public async update(model: Spot): Promise<void> {
		await this.prismaService.spot.update({
			where: { id: model.id() },
			data: {
				name: model.name(),
				description: model.description(),
				type: model.type(),
				updated_at: model.updatedAt(),
				is_deleted: model.isDeleted(),
				address: {
					update: {
						area: model.address().area(),
						sub_area: model.address().subArea(),
						longitude: model.address().longitude(),
						latitude: model.address().latitude(),
						locality: model.address().locality(),
						country_code: model.address().countryCode(),
					},
				},
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.spot.delete({
			where: { id: id },
		});
	}

	public async deleteVisitedSpot(id: string): Promise<void> {
		await this.prismaService.visitedSpot.delete({
			where: { id: id },
		});
	}
}

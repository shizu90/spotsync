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

	private _mountQuery(values: Object): Object {
		const name = values['name'] ?? null;
		const type = values['type'] ?? null;
		const creatorId = values['creatorId'] ?? null;
		const isDeleted = values['isDeleted'] ?? null;
		const favoritedById = values['favoritedById'] ?? null;
		const visitedById = values['visitedById'] ?? null;
		const spotId = values['spotId'] ?? null;
		
		let query = {
			favorites: {},
			visited_by: {}
		};

		if (favoritedById) {
			query['favorites']['user_id'] = favoritedById;
		}

		if (visitedById) {
			query['visited_by']['user_id'] = visitedById;
		}

		if (name) {
			query['name'] = name;
		}

		if (type) {
			query['type'] = type;
		}

		if (creatorId) {
			query['creator_id'] = creatorId;
		}

		if (isDeleted !== undefined && isDeleted !== null) {
			query['is_deleted'] = isDeleted;
		}

		if (spotId) {
			query['id'] = spotId;
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Spot>> {
		const query = this._mountQuery(params.filters); 
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
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.spot.findMany({
				where: query,
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
				where: query,
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
		const query = this._mountQuery(values);
		const spots = await this.prismaService.spot.findMany({
			where: query,
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
		const query = this._mountQuery(values);
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
		const query = this._mountQuery(values);
		const count = await this.prismaService.spot.count({
			where: query,
		});

		return count;
	}

	public async countVisitedSpotBy(values: Object): Promise<number> {
		const query = this._mountQuery(values);
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

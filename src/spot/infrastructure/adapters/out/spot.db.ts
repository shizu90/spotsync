import { Inject, Injectable } from '@nestjs/common';
import { CacheableRepository } from 'src/cache/cacheable.repository';
import { RedisService } from 'src/cache/redis.service';
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
export class SpotRepositoryImpl extends CacheableRepository implements SpotRepository {
	private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();
	private _visitedSpotEntityMapper: VisitedSpotEntityMapper =
		new VisitedSpotEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
		@Inject(RedisService)
		protected redisService: RedisService
	) {super(redisService);}

	private _mountQuery(values: Object): Object {
		const name = values['name'] ?? null;
		const type = values['type'] ?? null;
		const creatorId = values['creatorId'] ?? null;
		const isDeleted = values['isDeleted'] ?? null;
		const favoritedById = values['favoritedById'] ?? null;
		const visitedById = values['visitedById'] ?? null;
		const spotId = values['spotId'] ?? null;

		let query = {};

		if (favoritedById) {
			query['favorites'] = {};
			query['favorites'] = { some: { user_id: favoritedById } };
		}

		if (visitedById) {
			query['visited_by'] = {};
			query['visited_by']['user_id'] = visitedById;
		}

		if (name) {
			query['name'] = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (type) {
			query['type'] = {
				in: type,
			};
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

	private _mountInclude(): Object {
		return {
			address: true,
			attachments: true,
			creator: {
				include: {
					credentials: true,
					visibility_settings: true,
					profile: true,
				},
			},
		};
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Spot>> {
		const key = `spot:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((s) => this._spotEntityMapper.toModel(s)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

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
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.spot.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.spot.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		return new Pagination(
			items.map((s) => this._spotEntityMapper.toModel(s)),
			total,
			page + 1,
			limit,
		);
	}

	public async findByName(name: string): Promise<Spot> {
		const key = `spot:findByName:${name}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._spotEntityMapper.toModel(cachedData);
		}

		const spot = await this.prismaService.spot.findFirst({
			where: { name: name },
			include: this._mountInclude(),
		});

		await this._setCachedData(key, spot);

		return this._spotEntityMapper.toModel(spot);
	}

	public async findBy(values: Object): Promise<Spot[]> {
		const key = `spot:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((s) => this._spotEntityMapper.toModel(s));
		}

		const query = this._mountQuery(values);
		const spots = await this.prismaService.spot.findMany({
			where: query,
			include: this._mountInclude(),
		});

		await this._setCachedData(key, spots);

		return spots.map((s) => this._spotEntityMapper.toModel(s));
	}

	public async findVisitedSpotBy(
		values: Object,
	): Promise<Array<VisitedSpot>> {
		const key = `visited-spot:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((vs) =>
				this._visitedSpotEntityMapper.toModel(vs),
			);
		}

		const query = this._mountQuery(values);
		const visitedSpots = await this.prismaService.visitedSpot.findMany({
			where: query,
			include: {
				spot: {
					include: this._mountInclude(),
				},
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		await this._setCachedData(key, visitedSpots);

		return visitedSpots.map((vs) =>
			this._visitedSpotEntityMapper.toModel(vs),
		);
	}

	public async countBy(values: Object): Promise<number> {
		const key = `spot:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.spot.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async countVisitedSpotBy(values: Object): Promise<number> {
		const key = `visited-spot:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.visitedSpot.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async findAll(): Promise<Spot[]> {
		const key = 'spot:findAll';
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((s) => this._spotEntityMapper.toModel(s));
		}

		const spots = await this.prismaService.spot.findMany({
			include: this._mountInclude(),
		});

		await this._setCachedData(key, spots);

		return spots.map((s) => this._spotEntityMapper.toModel(s));
	}

	public async findById(id: string): Promise<Spot> {
		const key = `spot:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._spotEntityMapper.toModel(cachedData);
		}

		const spot = await this.prismaService.spot.findFirst({
			where: { id: id },
			include: this._mountInclude(),
		});

		await this._setCachedData(key, spot);

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
						street_number: model.address().streetNumber(),
						postal_code: model.address().postalCode(),
					},
				},
			},
			include: {
				address: true,
				attachments: true,
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		model.attachments().forEach(async (photo) => {
			await this.prismaService.spotAttachment.create({
				data: {
					id: photo.id(),
					spot_id: model.id(),
					file_path: photo.filePath(),
					file_type: photo.fileType(),
				}
			});
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
						attachments: true,
					},
				},
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
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
						street_number: model.address().streetNumber(),
						postal_code: model.address().postalCode(),
					},
				},
			},
		});

		await this.prismaService.spotAttachment.deleteMany({
			where: {
				spot_id: model.id(),
			},
		});

		model.attachments().forEach(async (photo) => {
			await this.prismaService.spotAttachment.create({
				data: {
					id: photo.id(),
					spot_id: model.id(),
					file_path: photo.filePath(),
					file_type: photo.fileType(),
				},
			});
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

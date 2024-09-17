import { Inject, Injectable } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotRepository } from 'src/spot/application/ports/out/spot.repository';
import { FavoritedSpot } from 'src/spot/domain/favorited-spot.model';
import { SpotAddress } from 'src/spot/domain/spot-address.model';
import { SpotPhoto } from 'src/spot/domain/spot-photo.model';
import { Spot } from 'src/spot/domain/spot.model';
import { VisitedSpot } from 'src/spot/domain/visited-spot.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { User } from 'src/user/domain/user.model';

@Injectable()
export class SpotRepositoryImpl implements SpotRepository {
	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	private mapSpotToDomain(prisma_model: any): Spot {
		if (prisma_model === null || prisma_model === undefined) return null;

		return Spot.create(
			prisma_model.id,
			prisma_model.name,
			prisma_model.description,
			prisma_model.type,
			prisma_model.address
				? SpotAddress.create(
						prisma_model.address.id,
						prisma_model.address.area,
						prisma_model.address.sub_area,
						prisma_model.address.latitude,
						prisma_model.address.longitude,
						prisma_model.address.country_code,
						prisma_model.address.locality,
					)
				: null,
			prisma_model.photos.map((p) => {
				return SpotPhoto.create(p.id, p.file_path);
			}),
			prisma_model.creator
				? User.create(
					prisma_model.creator.id,
					UserProfile.create(
						prisma_model.creator.id,
						prisma_model.creator.profile.birth_date,
						prisma_model.creator.profile.display_name,
						prisma_model.creator.profile.theme_color,
						prisma_model.creator.profile.profile_picture,
						prisma_model.creator.profile.banner_picture,
						prisma_model.creator.profile.biograph,
						prisma_model.creator.profile.visibility
					),
					UserCredentials.create(
						prisma_model.creator.id,
						prisma_model.creator.credentials.name,
						prisma_model.creator.credentials.email,
						prisma_model.creator.credentials.password,
						prisma_model.creator.credentials.phone_number,
						prisma_model.creator.credentials.last_login,
						prisma_model.creator.credentials.last_logout,
					),
					UserVisibilitySettings.create(
						prisma_model.creator.id,
						prisma_model.creator.visibility_settings.profile,
						prisma_model.creator.visibility_settings.addresses,
						prisma_model.creator.visibility_settings.spot_folders,
						prisma_model.creator.visibility_settings.visited_spots,
						prisma_model.creator.visibility_settings.posts,
						prisma_model.creator.visibility_settings.favorite_spots,
						prisma_model.creator.visibility_settings.favorite_spot_folders,
						prisma_model.creator.visibility_settings.favorite_spot_events,
					),
					prisma_model.creator.status,
					prisma_model.creator.created_at,
					prisma_model.creator.updated_at,
					prisma_model.creator.is_deleted
					)
				: null,
			prisma_model.created_at,
			prisma_model.updated_at,
			prisma_model.is_deleted,
		);
	}

	private mapFavoritedSpotToDomain(prisma_model: any): FavoritedSpot {
		if (prisma_model === null || prisma_model === undefined) return null;

		return FavoritedSpot.create(
			prisma_model.id,
			prisma_model.spot ? this.mapSpotToDomain(prisma_model.spot) : null,
			prisma_model.user
				? User.create(
					prisma_model.user.id,
					UserProfile.create(
						prisma_model.user.id,
						prisma_model.user.profile.birth_date,
						prisma_model.user.profile.display_name,
						prisma_model.user.profile.theme_color,
						prisma_model.user.profile.profile_picture,
						prisma_model.user.profile.banner_picture,
						prisma_model.user.profile.biograph,
						prisma_model.user.profile.visibility
					),
					UserCredentials.create(
						prisma_model.user.id,
						prisma_model.user.credentials.name,
						prisma_model.user.credentials.email,
						prisma_model.user.credentials.password,
						prisma_model.user.credentials.phone_number,
						prisma_model.user.credentials.last_login,
						prisma_model.user.credentials.last_logout,
					),
					UserVisibilitySettings.create(
						prisma_model.user.id,
						prisma_model.user.visibility_settings.profile,
						prisma_model.user.visibility_settings.addresses,
						prisma_model.user.visibility_settings.spot_folders,
						prisma_model.user.visibility_settings.visited_spots,
						prisma_model.user.visibility_settings.posts,
						prisma_model.user.visibility_settings.favorite_spots,
						prisma_model.user.visibility_settings.favorite_spot_folders,
						prisma_model.user.visibility_settings.favorite_spot_events,
					),
					prisma_model.user.status,
					prisma_model.user.created_at,
					prisma_model.user.updated_at,
					prisma_model.user.is_deleted
					)
				: null,
			prisma_model.favorited_at,
		);
	}

	private mapVisitedSpotToDomain(prisma_model: any): VisitedSpot {
		if (prisma_model === null || prisma_model === undefined) return null;

		return VisitedSpot.create(
			prisma_model.id,
			prisma_model.spot ? this.mapSpotToDomain(prisma_model.spot) : null,
			prisma_model.user
				? User.create(
					prisma_model.user.id,
					UserProfile.create(
						prisma_model.user.id,
						prisma_model.user.profile.birth_date,
						prisma_model.user.profile.display_name,
						prisma_model.user.profile.theme_color,
						prisma_model.user.profile.profile_picture,
						prisma_model.user.profile.banner_picture,
						prisma_model.user.profile.biograph,
						prisma_model.user.profile.visibility
					),
					UserCredentials.create(
						prisma_model.user.id,
						prisma_model.user.credentials.name,
						prisma_model.user.credentials.email,
						prisma_model.user.credentials.password,
						prisma_model.user.credentials.phone_number,
						prisma_model.user.credentials.last_login,
						prisma_model.user.credentials.last_logout,
					),
					UserVisibilitySettings.create(
						prisma_model.user.id,
						prisma_model.user.visibility_settings.profile,
						prisma_model.user.visibility_settings.addresses,
						prisma_model.user.visibility_settings.spot_folders,
						prisma_model.user.visibility_settings.visited_spots,
						prisma_model.user.visibility_settings.posts,
						prisma_model.user.visibility_settings.favorite_spots,
						prisma_model.user.visibility_settings.favorite_spot_folders,
						prisma_model.user.visibility_settings.favorite_spot_events,
					),
					prisma_model.user.status,
					prisma_model.user.created_at,
					prisma_model.user.updated_at,
					prisma_model.user.is_deleted
					)
				: null,
			prisma_model.visited_at,
		);
	}

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
				items.map((s) => this.mapSpotToDomain(s)),
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

		return this.mapSpotToDomain(spot);
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

		return spots.map((s) => this.mapSpotToDomain(s));
	}

	public async findFavoritedSpotBy(
		values: Object,
	): Promise<Array<FavoritedSpot>> {
		const spotId = values['spotId'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (spotId !== null) {
			query['spot_id'] = spotId;
		}

		if (userId !== null) {
			query['user_id'] = userId;
		}

		const favoritedSpots = await this.prismaService.favoritedSpot.findMany({
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

		return favoritedSpots.map((fs) => this.mapFavoritedSpotToDomain(fs));
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

		return visitedSpots.map((vs) => this.mapVisitedSpotToDomain(vs));
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

	public async countFavoritedSpotBy(values: Object): Promise<number> {
		const spotId = values['spotId'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (spotId !== null) {
			query['spot_id'] = spotId;
		}

		if (userId !== null) {
			query['user_id'] = userId;
		}

		const count = await this.prismaService.favoritedSpot.count({
			where: query,
		});

		return count;
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

		return spots.map((s) => this.mapSpotToDomain(s));
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

		return this.mapSpotToDomain(spot);
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

		return this.mapSpotToDomain(spot);
	}

	public async storeFavoritedSpot(
		model: FavoritedSpot,
	): Promise<FavoritedSpot> {
		const favoritedSpot = await this.prismaService.favoritedSpot.create({
			data: {
				id: model.id(),
				spot_id: model.spot().id(),
				user_id: model.user().id(),
				favorited_at: model.favoritedAt(),
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

		return this.mapFavoritedSpotToDomain(favoritedSpot);
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

		return this.mapVisitedSpotToDomain(visitedSpot);
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

	public async deleteFavoritedSpot(id: string): Promise<void> {
		await this.prismaService.favoritedSpot.delete({
			where: { id: id },
		});
	}

	public async deleteVisitedSpot(id: string): Promise<void> {
		await this.prismaService.visitedSpot.delete({
			where: { id: id },
		});
	}
}

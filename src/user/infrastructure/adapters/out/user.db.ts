import { Inject } from '@nestjs/common';
import * as moment from 'moment';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/user/application/ports/out/user.repository';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { User } from 'src/user/domain/user.model';
import { UserEntityMapper } from './mappers/user-entity.mapper';

export class UserRepositoryImpl implements UserRepository {
	private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

	public constructor(
		@Inject(PrismaService) protected prismaService: PrismaService,
		@Inject(RedisService) protected redisService: RedisService,
	) {}

	private async _getCachedData(key: string): Promise<any> {
		const data = await this.redisService.get(key);
		
		if (data) return JSON.parse(data, (key, value) => {
			const valid = moment(value, moment.ISO_8601, true).isValid();

			if (valid) return moment(value);
		});

		return null;
	}

	private async _setCachedData(key: string, data: any, ttl: number): Promise<void> {
		await this.redisService.set(key, JSON.stringify(data), "EX", ttl);
	}

	private _mountQuery(params: Object): Object {
		const name = params['name'];
		const displayName = params['displayName'];
		const status = params['status'];
		const isDeleted = params['isDeleted'];

		let query = {
			credentials: {},
			profile: {},
		};

		if (name) {
			query['credentials']['name'] = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (displayName) {
			query['profile']['display_name'] = {
				contains: displayName,
				mode: 'insensitive',
			};
		}

		if (status) {
			query['status'] = status;
		}

		if (isDeleted) {
			query['is_deleted'] = isDeleted;
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<User>> {
		const key = `users:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._userEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params.filters);
		const sort = params.sort ?? 'name';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'displayName':
			case 'display_name':
				orderBy = { profile: { display_name: sortDirection } };
				break;
			case 'created_at':
			case 'createdAt':
				orderBy = { created_at: sortDirection };
				break;
			case 'updated_at':
			case 'updatedAt':
				orderBy = { updated_at: sortDirection };
				break;
			case 'name':
			default:
				orderBy = { credentials: { name: sortDirection } };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.user.findMany({
				where: query,
				orderBy: orderBy,
				include: {
					credentials: true,
					visibility_settings: true,
					profile: true,
				},
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.user.findMany({
				where: query,
				orderBy: orderBy,
				include: {
					credentials: true,
					visibility_settings: true,
					profile: true,
				},
			});
		}

		await this._setCachedData(key,
			new Pagination(items, total, page + 1, limit),
			60,
		);

		items = items.map((i) => {
			return this._userEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<Array<User>> {
		const key = `users:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) return cachedData.map((i) => this._userEntityMapper.toModel(i));

		const query = this._mountQuery(values);

		const users = await this.prismaService.user.findMany({
			where: query,
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		await this._setCachedData(key, users, 60);

		return users.map((user) => this._userEntityMapper.toModel(user));
	}

	public async countBy(values: Object): Promise<number> {
		const key = `users:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) return cachedData;

		const query = this._mountQuery(values);

		const count = await this.prismaService.user.count({
			where: query,
		});

		await this._setCachedData(key, count, 60);

		return count;
	}

	public async findAll(): Promise<Array<User>> {
		const key = 'users:findAll';
		const cachedData = await this._getCachedData(key);

		if (cachedData) return cachedData.map((i) => this._userEntityMapper.toModel(i));

		const users = await this.prismaService.user.findMany({
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		await this._setCachedData(key, users, 60);

		return users.map((user) => this._userEntityMapper.toModel(user));
	}

	public async findById(id: string): Promise<User> {
		const key = `users:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) return this._userEntityMapper.toModel(cachedData);

		const user = await this.prismaService.user.findFirst({
			where: {
				id: id,
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		await this._setCachedData(key, user, 60);

		return this._userEntityMapper.toModel(user);
	}

	public async findByName(name: string): Promise<User> {
		const key = `users:findByName:${name}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) return this._userEntityMapper.toModel(cachedData);

		const user = await this.prismaService.user.findFirst({
			where: {
				credentials: {
					name: name,
				},
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		await this._setCachedData(key, user, 60);

		return this._userEntityMapper.toModel(user);
	}

	public async findByEmail(email: string): Promise<User> {
		const key = `users:findByEmail:${email}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) return this._userEntityMapper.toModel(cachedData);

		const user = await this.prismaService.user.findFirst({
			where: {
				credentials: {
					email: email,
				},
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		await this._setCachedData(key, user, 60);

		return this._userEntityMapper.toModel(user);
	}

	public async store(model: User): Promise<User> {
		const user = await this.prismaService.user.create({
			data: {
				id: model.id(),
				status: model.status(),
				is_deleted: model.isDeleted(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				credentials: {
					create: {
						name: model.credentials().name(),
						email: model.credentials().email(),
						password: model.credentials().password(),
					},
				},
				profile: {
					create: {
						birth_date: model.profile().birthDate(),
						display_name: model.profile().displayName(),
						theme_color: model.profile().themeColor(),
						profile_picture: model.profile().profilePicture(),
						banner_picture: model.profile().bannerPicture(),
						biograph: model.profile().biograph(),
						visibility: model.profile().visibility(),
					},
				},
				visibility_settings: {
					create: {
						profile: model.visibilitySettings().profile(),
						addresses: model.visibilitySettings().addresses(),
						spot_folders: model.visibilitySettings().spotFolders(),
						visited_spots: model
							.visibilitySettings()
							.visitedSpots(),
						posts: model.visibilitySettings().posts(),
						favorite_spots: model
							.visibilitySettings()
							.favoriteSpots(),
						favorite_spot_folders: model
							.visibilitySettings()
							.favoriteSpotFolders(),
						favorite_spot_events: model
							.visibilitySettings()
							.favoriteSpotEvents(),
					},
				},
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		return this._userEntityMapper.toModel(user);
	}

	public async update(model: User): Promise<void> {
		await this.prismaService.user.update({
			data: {
				status: model.status(),
				is_deleted: model.isDeleted(),
				updated_at: model.updatedAt(),
			},
			where: {
				id: model.id(),
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});
	}

	public async updateCredentials(model: UserCredentials): Promise<void> {
		await this.prismaService.user.update({
			data: {
				credentials: {
					update: {
						where: { user_id: model.id() },
						data: {
							email: model.email(),
							name: model.name(),
							password: model.password(),
							phone_number: model.phoneNumber(),
							last_login: model.lastLogin(),
							last_logout: model.lastLogout(),
						},
					},
				},
			},
			where: {
				id: model.id(),
			},
		});
	}

	public async updateProfile(model: UserProfile): Promise<void> {
		const user = await this.prismaService.user.update({
			where: { id: model.id() },
			data: {
				profile: {
					update: {
						data: {
							birth_date: model.birthDate(),
							display_name: model.displayName(),
							theme_color: model.themeColor(),
							profile_picture: model.profilePicture(),
							banner_picture: model.bannerPicture(),
							biograph: model.biograph(),
							visibility: model.visibility(),
						},
					},
				},
			},
		});
	}

	public async updateVisibilitySettings(
		model: UserVisibilitySettings,
	): Promise<void> {
		const user = await this.prismaService.user.update({
			where: { id: model.id() },
			data: {
				visibility_settings: {
					update: {
						data: {
							profile: model.profile(),
							addresses: model.addresses(),
							spot_folders: model.spotFolders(),
							visited_spots: model.visitedSpots(),
							posts: model.posts(),
							favorite_spots: model.favoriteSpots(),
							favorite_spot_folders: model.favoriteSpotFolders(),
							favorite_spot_events: model.favoriteSpotEvents(),
						},
					},
				},
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.user.delete({
			where: { id: id },
		});
	}
}

import { Inject } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAddressRepository } from 'src/user/application/ports/out/user-address.repository';
import { UserAddress } from 'src/user/domain/user-address.model';
import { UserAddressEntityMapper } from './mappers/user-address-entity.mapper';

export class UserAddressRepositoryImpl implements UserAddressRepository {
	private _userAddressEntityMapper: UserAddressEntityMapper = new UserAddressEntityMapper();

	public constructor(
		@Inject(PrismaService) protected prismaService: PrismaService,
	) {}

	private _mountQuery(params: Object): Object {
		const userId = params['userId'];
		const main = params['main'];
		const name = params['name'];
		const isDeleted = params['isDeleted'];

		let query = {};

		if (userId) {
			query['user_id'] = userId;
		}

		if (main !== undefined) {
			query['main'] = main;
		}

		if (name) {
			query['name'] = name;
		}

		if (isDeleted !== undefined) {
			query['is_deleted'] = isDeleted;
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<UserAddress>> {
		const query = this._mountQuery(params.filters);
		const sort = params.sort ?? 'name';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
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
				orderBy = { name: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1)-1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.userAddress.findMany({
				where: query,
				orderBy: orderBy,
				include: {
					user: {
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
			items = await this.prismaService.userAddress.findMany({
				where: query,
				orderBy: orderBy,
				include: {
					user: {
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
			return this._userAddressEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<Array<UserAddress>> {
		const query = this._mountQuery(values);
		const userAddresses = await this.prismaService.userAddress.findMany({
			where: query,
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return userAddresses.map((userAddress) => {
			return this._userAddressEntityMapper.toModel(userAddress);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const query = this._mountQuery(values);
		const count = await this.prismaService.userAddress.count({
			where: query,
		});

		return count;
	}

	public async findAll(): Promise<Array<UserAddress>> {
		const userAddresses = await this.prismaService.userAddress.findMany({
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return userAddresses.map((userAddress) => {
			return this._userAddressEntityMapper.toModel(userAddress);
		});
	}

	public async findById(id: string): Promise<UserAddress> {
		const userAddress = await this.prismaService.userAddress.findFirst({
			where: {
				id: id,
			},
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return this._userAddressEntityMapper.toModel(userAddress);
	}

	public async store(model: UserAddress): Promise<UserAddress> {
		const userAddress = await this.prismaService.userAddress.create({
			data: {
				id: model.id(),
				name: model.name(),
				area: model.area(),
				sub_area: model.subArea(),
				latitude: model.latitude(),
				longitude: model.longitude(),
				country_code: model.countryCode(),
				locality: model.locality(),
				main: model.main(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				user_id: model.user().id(),
			},
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return this._userAddressEntityMapper.toModel(userAddress);
	}

	public async update(model: UserAddress): Promise<void> {
		await this.prismaService.userAddress.update({
			where: {
				id: model.id(),
			},
			data: {
				name: model.name(),
				area: model.area(),
				sub_area: model.subArea(),
				locality: model.locality(),
				country_code: model.countryCode(),
				latitude: model.latitude(),
				longitude: model.longitude(),
				main: model.main(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				is_deleted: model.isDeleted(),
			},
			include: {
				user: {
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
		this.prismaService.userAddress.delete({
			where: { id: id },
		});
	}
}

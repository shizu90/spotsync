import { Inject, Injectable } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotFolderRepository } from 'src/spot-folder/application/ports/out/spot-folder.repository';
import { SpotFolder } from 'src/spot-folder/domain/spot-folder.model';
import { SpotFolderEntityMapper } from './mappers/spot-folder-entity.mapper';

@Injectable()
export class SpotFolderRepositoryImpl implements SpotFolderRepository {
	private _spotFolderEntityMapper: SpotFolderEntityMapper =
		new SpotFolderEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	private _mountInclude(): Object {
		return {
			creator: {
				include: {
					credentials: true,
					visibility_settings: true,
					profile: true,
				},
			},
			spots: {
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
				},
			},
		};
	}

	private _mountQuery(values: Object): Object {
		const name = values['name'] ?? null;
		const userId = values['userId'] ?? null;
		const visibility = values['visibility'] ?? null;

		let query = {};

		if (name) {
			query['name'] = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (userId) {
			query['user_id'] = userId;
		}

		if (visibility) {
			query['visibility'] = visibility;
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<SpotFolder>> {
		const query = this._mountQuery(params.filters);
		const sort = params.sort || 'created_at';
		const sortDirection = params.sortDirection || SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'name':
				orderBy = {
					name: sortDirection,
				};
				break;
			case 'created_at':
			case 'createdAt':
			default:
				orderBy = {
					created_at: sortDirection,
				};
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.spotFolder.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: page * limit,
				take: limit,
			});
		} else {
			items = await this.prismaService.spotFolder.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		return new Pagination(
			items.map((item) => this._spotFolderEntityMapper.toModel(item)),
			total,
			page + 1,
			limit,
		);
	}

	public async findBy(values: Object): Promise<SpotFolder[]> {
		const query = this._mountQuery(values);
		const items = await this.prismaService.spotFolder.findMany({
			where: query,
			include: this._mountInclude(),
		});

		return items.map((item) => this._spotFolderEntityMapper.toModel(item));
	}

	public async countBy(values: Object): Promise<number> {
		const query = this._mountQuery(values);
		const count = await this.prismaService.spotFolder.count({
			where: query,
		});

		return count;
	}

	public async findAll(): Promise<SpotFolder[]> {
		const items = await this.prismaService.spotFolder.findMany({
			include: this._mountInclude(),
		});

		return items.map((item) => this._spotFolderEntityMapper.toModel(item));
	}

	public async findById(id: string): Promise<SpotFolder> {
		const item = await this.prismaService.spotFolder.findUnique({
			where: {
				id: id,
			},
			include: this._mountInclude(),
		});

		return this._spotFolderEntityMapper.toModel(item);
	}

	public async store(model: SpotFolder): Promise<SpotFolder> {
		const spotFolder = await this.prismaService.spotFolder.create({
			data: {
				id: model.id(),
				name: model.name(),
				hex_color: model.hexColor(),
				description: model.description(),
				visibility: model.visibility(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				user_id: model.creator().id(),
				spots: {
					createMany: {
						data: model.items().map((item) => {
							return {
								spot_id: item.spot().id(),
								order_number: item.orderNumber(),
								added_at: item.addedAt(),
							};
						}),
					},
				},
			},
			include: this._mountInclude(),
		});

		return this._spotFolderEntityMapper.toModel(spotFolder);
	}

	public async update(model: SpotFolder): Promise<void> {
		await this.prismaService.spotFolder.update({
			data: {
				name: model.name(),
				hex_color: model.hexColor(),
				description: model.description(),
				visibility: model.visibility(),
				updated_at: model.updatedAt(),
			},
			where: {
				id: model.id(),
			},
		});

		await this.prismaService.spotFolderItem.deleteMany({
			where: {
				spot_folder_id: model.id(),
			},
		});

		for (const item of model.items()) {
			await this.prismaService.spotFolderItem.create({
				data: {
					spot_id: item.spot().id(),
					order_number: item.orderNumber(),
					added_at: item.addedAt(),
					spot_folder_id: model.id(),
				},
			});
		}
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.spotFolder.delete({
			where: {
				id: id,
			},
		});
	}
}
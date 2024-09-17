import { Inject, Injectable } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupMemberRepository } from 'src/group/application/ports/out/group-member.repository';
import { GroupMember } from 'src/group/domain/group-member.model';
import { GroupPermission } from 'src/group/domain/group-permission.model';
import { GroupRole } from 'src/group/domain/group-role.model';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { Group } from 'src/group/domain/group.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { User } from 'src/user/domain/user.model';

@Injectable()
export class GroupMemberRepositoryImpl implements GroupMemberRepository {
	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	private mapGroupMemberToDomain(prisma_model: any): GroupMember {
		if (prisma_model === null || prisma_model === undefined) return null;

		return GroupMember.create(
			prisma_model.id,
			prisma_model.group
				? Group.create(
						prisma_model.group.id,
						prisma_model.group.name,
						prisma_model.group.about,
						prisma_model.group.group_picture,
						prisma_model.group.banner_picture,
						prisma_model.group.visibility_settings
							? GroupVisibilitySettings.create(
									prisma_model.group.id,
									prisma_model.group.visibility_settings
										.posts,
									prisma_model.group.visibility_settings
										.spot_events,
									prisma_model.group.visibility_settings
										.groups,
								)
							: null,
						prisma_model.group.created_at,
						prisma_model.group.updated_at,
						prisma_model.group.is_deleted,
					)
				: null,
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
			GroupRole.create(
				prisma_model.group_role.id,
				prisma_model.group_role.name,
				prisma_model.group_role.hex_color,
				prisma_model.group_role.permissions.map((p) => {
					return GroupPermission.create(
						p.group_permission.id,
						p.group_permission.name,
					);
				}),
				prisma_model.group_role.is_immutable,
			),
			prisma_model.is_creator,
			prisma_model.status,
			prisma_model.joined_at,
		);
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<GroupMember>> {
		let query = `SELECT group_members.id FROM group_members JOIN users ON users.id = group_members.user_id JOIN user_credentials ON user_credentials.user_id = users.id WHERE users.is_deleted = false`;

		if (params.filters) {
			if (typeof params.filters['name'] === 'string') {
				const name = params.filters['name'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
				} else {
					query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
				}
			}

			if (typeof params.filters['roleId'] === 'string') {
				const roleId = params.filters['roleId'];
				if (query.includes('WHERE')) {
					query = `${query} AND group_members.role_id = '${roleId}'`;
				} else {
					query = `${query} WHERE group_members.role_id = '${roleId}'`;
				}
			}

			if (typeof params.filters['groupId'] === 'string') {
				const groupId = params.filters['groupId'];
				if (query.includes('WHERE')) {
					query = `${query} AND group_members.group_id = '${groupId}'`;
				} else {
					query = `${query} WHERE group_members.group_id = '${groupId}'`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const sort = params.sort ?? 'name';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'name':
				orderBy = { user: { credentials: { name: sortDirection } } };
				break;
			case 'joined_at':
			case 'joinedAt':
			default:
				orderBy = { joined_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1)-1;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.groupMember.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
					group_role: {
						include: {
							permissions: {
								include: {
									group_permission: true,
								},
							},
						},
					},
					group: {
						include: {
							visibility_settings: true,
						},
					},
				},
				skip: page * limit,
				take: limit,
			});
		} else {
			items = await this.prismaService.groupMember.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
					group_role: {
						include: {
							permissions: {
								include: {
									group_permission: true,
								},
							},
						},
					},
					group: {
						include: {
							visibility_settings: true,
						},
					},
				},
			});
		}

		items = items.map((i) => {
			return this.mapGroupMemberToDomain(i);
		});

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<Array<GroupMember>> {
		const id = values['id'];
		const status = values['status'];
		const name = values['name'];
		const roleId = values['roleId'];
		const groupId = values['groupId'];
		const userId = values['userId'];

		let query =
			'SELECT group_members.id FROM group_members JOIN users ON users.id = group_members.user_id JOIN user_credentials ON user_credentials.user_id = users.id WHERE users.is_deleted = false';

		if (id) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.id = '${id}'`;
			} else {
				query = `${query} WHERE group_members.id = '${id}'`;
			}
		}

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.status = '${status}'`;
			} else {
				query = `${query} WHERE group_members.status = '${status}'`;
			}
		}

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			} else {
				query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			}
		}

		if (roleId) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.role_id = '${roleId}'`;
			} else {
				query = `${query} WHERE group_members.role_id = '${roleId}'`;
			}
		}

		if (groupId) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.group_id = '${groupId}'`;
			} else {
				query = `${query} WHERE group_members.group_id = '${groupId}'`;
			}
		}

		if (userId) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.user_id = '${userId}'`;
			} else {
				query = `${query} WHERE group_members.user_id = '${userId}'`;
			}
		}

		const groupMemberIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const groupMembers = await this.prismaService.groupMember.findMany({
			where: { id: { in: groupMemberIds.map((row) => row.id) } },
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				group_role: {
					include: {
						permissions: {
							include: {
								group_permission: true,
							},
						},
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return groupMembers.map((gm) => {
			return this.mapGroupMemberToDomain(gm);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const name = values['name'];
		const roleId = values['roleId'];
		const groupId = values['groupId'];
		const userId = values['userId'];

		let query =
			'SELECT group_members.id FROM group_members JOIN users ON users.id = group_members.user_id JOIN user_credentials ON user_credentials.user_id = users.id WHERE users.is_deleted = false';

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			} else {
				query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			}
		}

		if (roleId) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.role_id = '${roleId}'`;
			} else {
				query = `${query} WHERE group_members.role_id = '${roleId}'`;
			}
		}

		if (groupId) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.group_id = '${groupId}'`;
			} else {
				query = `${query} WHERE group_members.group_id = '${groupId}'`;
			}
		}

		if (userId) {
			if (query.includes('WHERE')) {
				query = `${query} AND group_members.user_id = '${userId}'`;
			} else {
				query = `${query} WHERE group_members.user_id = '${userId}'`;
			}
		}

		const groupMemberIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const count = await this.prismaService.groupMember.count({
			where: { id: { in: groupMemberIds.map((row) => row.id) } },
		});

		return count;
	}

	public async findAll(): Promise<Array<GroupMember>> {
		const groupMembers = await this.prismaService.groupMember.findMany({
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				group_role: {
					include: {
						permissions: {
							include: {
								group_permission: true,
							},
						},
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return groupMembers.map((gm) => {
			return this.mapGroupMemberToDomain(gm);
		});
	}

	public async findById(id: string): Promise<GroupMember> {
		const groupMember = await this.prismaService.groupMember.findFirst({
			where: { id: id },
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				group_role: {
					include: {
						permissions: {
							include: {
								group_permission: true,
							},
						},
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return this.mapGroupMemberToDomain(groupMember);
	}

	public async store(model: GroupMember): Promise<GroupMember> {
		const groupMember = await this.prismaService.groupMember.create({
			data: {
				group_id: model.group().id(),
				user_id: model.user().id(),
				is_creator: model.isCreator(),
				group_role_id: model.role().id(),
				id: model.id(),
				joined_at: model.joinedAt(),
				requested_at: model.requestedAt(),
				status: model.status(),
			},
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				group_role: {
					include: {
						permissions: {
							include: {
								group_permission: true,
							},
						},
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return this.mapGroupMemberToDomain(groupMember);
	}

	public async update(model: GroupMember): Promise<void> {
		await this.prismaService.groupMember.update({
			data: {
				group_role_id: model.role().id(),
				status: model.status(),
				requested_at: model.requestedAt(),
				joined_at: model.joinedAt(),
			},
			where: { id: model.id() },
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				group_role: {
					include: {
						permissions: {
							include: {
								group_permission: true,
							},
						},
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.groupMember.delete({
			where: { id: id },
		});
	}
}

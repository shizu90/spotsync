import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupRoleUseCase } from '../ports/in/use-cases/create-group-role.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { CreateGroupRoleCommand } from '../ports/in/commands/create-group-role.command';
import { CreateGroupRoleDto } from '../ports/out/dto/create-group-role.dto';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupRole } from 'src/group/domain/group-role.model';
import { randomUUID } from 'crypto';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../ports/out/group-role.repository';
import { GroupPermission } from 'src/group/domain/group-permission.model';

@Injectable()
export class CreateGroupRoleService implements CreateGroupRoleUseCase {
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupRoleRepositoryProvider)
		protected groupRoleRepository: GroupRoleRepository,
	) {}

	public async execute(
		command: CreateGroupRoleCommand,
	): Promise<CreateGroupRoleDto> {
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined) {
			throw new GroupNotFoundError(`Group not found`);
		}

		const authenticatedGroupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUserId,
			})
		).at(0);

		if (
			authenticatedGroupMember === null ||
			authenticatedGroupMember === undefined
		) {
			throw new UnauthorizedAccessError(
				`You're not a member of the group`,
			);
		}

		const hasPermission = authenticatedGroupMember
			.role()
			.permissions()
			.map((p) => p.name())
			.includes('create-role');

		if (
			!(
				hasPermission ||
				authenticatedGroupMember.isCreator() ||
				authenticatedGroupMember.role().name() === 'administrator'
			)
		) {
			throw new UnauthorizedAccessError(
				`You don't have permissions to create role`,
			);
		}

		const groupRole = GroupRole.create(
			randomUUID(),
			command.name,
			command.hexColor,
			await Promise.all(
				command.permissionIds.map(async (pid) => {
					const permission =
						await this.groupRoleRepository.findPermissionById(pid);

					if (permission !== null && permission !== undefined) {
						return permission;
					} else return null;
				}),
			),
			false,
			group,
		);

		this.groupRoleRepository.store(groupRole);

		return new CreateGroupRoleDto(
			groupRole.id(),
			groupRole.name(),
			groupRole.hexColor(),
			groupRole.permissions().map((p) => {
				return { id: p.id(), name: p.name() };
			}),
			groupRole.createdAt(),
			groupRole.updatedAt(),
			groupRole.isImmutable(),
		);
	}
}

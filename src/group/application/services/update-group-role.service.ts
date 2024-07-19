import { Inject, Injectable } from '@nestjs/common';
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
import { UpdateGroupRoleUseCase } from '../ports/in/use-cases/update-group-role.use-case';
import { UpdateGroupRoleCommand } from '../ports/in/commands/update-group-role.command';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../ports/out/group-role.repository';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupRoleNotFoundError } from './errors/group-role-not-found.error';
import { GroupLog } from 'src/group/domain/group-log.model';
import { randomUUID } from 'crypto';

@Injectable()
export class UpdateGroupRoleService implements UpdateGroupRoleUseCase {
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

	public async execute(command: UpdateGroupRoleCommand): Promise<void> {
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
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

		if (!authenticatedGroupMember.canExecute('update-role')) {
			throw new UnauthorizedAccessError(
				`You don't have permissions to update role`,
			);
		}

		const groupRole = await this.groupRoleRepository.findById(command.id);

		if (
			groupRole === null ||
			groupRole === undefined ||
			(groupRole.group() !== null &&
				groupRole.group().id() !== group.id())
		) {
			throw new GroupRoleNotFoundError(`Group role not found`);
		}

		if (command.name && command.name !== null && command.name.length > 0) {
			groupRole.changeName(command.name);
		}

		if (
			command.hexColor &&
			command.hexColor !== null &&
			command.hexColor.length > 0
		) {
			groupRole.changeHexColor(command.hexColor);
		}

		if (command.permissionIds && command.permissionIds.length > 0) {
			groupRole.permissions().forEach((p) => {
				groupRole.removePermission(p);
			});

			command.permissionIds.forEach(async (pid) => {
				const permission =
					await this.groupRoleRepository.findPermissionById(pid);

				if (permission !== null && permission !== undefined) {
					groupRole.addPermission(permission);
				}
			});
		}

		this.groupRoleRepository.update(groupRole);

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} updated the role ${groupRole.name()}`,
		);

		this.groupRepository.storeLog(log);
	}
}

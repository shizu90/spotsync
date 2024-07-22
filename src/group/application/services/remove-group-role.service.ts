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
import { RemoveGroupRoleUseCase } from '../ports/in/use-cases/remove-group-role.use-case';
import { RemoveGroupRoleCommand } from '../ports/in/commands/remove-group-role.command';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../ports/out/group-role.repository';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupRoleNotFoundError } from './errors/group-role-not-found.error';
import { GroupLog } from 'src/group/domain/group-log.model';
import { randomUUID } from 'crypto';
import { PermissionName } from 'src/group/domain/permission-name.enum';
import { GroupNotFoundError } from './errors/group-not-found.error';

@Injectable()
export class RemoveGroupRoleService implements RemoveGroupRoleUseCase {
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

	public async execute(command: RemoveGroupRoleCommand): Promise<void> {
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

		if (!authenticatedGroupMember.canExecute(PermissionName.REMOVE_ROLE)) {
			throw new UnauthorizedAccessError(
				`You don't have permissions to delete role`,
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

		this.groupRoleRepository.delete(groupRole.id());

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} removed the role ${groupRole.name()}`,
		);

		this.groupRepository.storeLog(log);
	}
}

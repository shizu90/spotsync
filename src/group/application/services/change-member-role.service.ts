import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { ChangeMemberRoleCommand } from '../ports/in/commands/change-member-role.command';
import { ChangeMemberRoleUseCase } from '../ports/in/use-cases/change-member-role.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../ports/out/group-role.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GroupMemberNotFoundError } from './errors/group-member-not-found.error';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { GroupRoleNotFoundError } from './errors/group-role-not-found.error';

@Injectable()
export class ChangeMemberRoleService implements ChangeMemberRoleUseCase {
	constructor(
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupRoleRepositoryProvider)
		protected groupRoleRepository: GroupRoleRepository,
	) {}

	public async execute(command: ChangeMemberRoleCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError();
		}

		const authenticatedGroupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUser.id(),
			})
		).at(0);

		if (
			authenticatedGroupMember === null ||
			authenticatedGroupMember === undefined
		) {
			throw new UnauthorizedAccessError();
		}

		if (
			!authenticatedGroupMember.canExecute(
				GroupPermissionName.CHANGE_MEMBER_ROLE,
			)
		) {
			throw new UnauthorizedAccessError();
		}

		const groupMember = await this.groupMemberRepository.findById(
			command.id,
		);

		if (groupMember === null || groupMember === undefined) {
			throw new GroupMemberNotFoundError();
		}

		const role = await this.groupRoleRepository.findById(command.roleId);

		if (role === null || role === undefined) {
			throw new GroupRoleNotFoundError();
		}

		groupMember.changeRole(role);

		this.groupMemberRepository.update(groupMember);

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} changed the role of ${groupMember.user().credentials().name()}`,
		);

		this.groupRepository.storeLog(log);
	}
}

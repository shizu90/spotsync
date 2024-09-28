import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { UpdateGroupRoleCommand } from '../ports/in/commands/update-group-role.command';
import { UpdateGroupRoleUseCase } from '../ports/in/use-cases/update-group-role.use-case';
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
import { GroupNotFoundError } from './errors/group-not-found.error';
import { GroupRoleAlreadyExistsError } from './errors/group-role-already-exists.error';
import { GroupRoleNotFoundError } from './errors/group-role-not-found.error';

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
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError();
		}

		const authenticatedGroupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUser.id(),
				status: GroupMemberStatus.ACTIVE,
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
				GroupPermissionName.UPDATE_ROLE,
			)
		) {
			throw new UnauthorizedAccessError();
		}

		const groupRole = await this.groupRoleRepository.findById(command.id);

		if (
			groupRole === null ||
			groupRole === undefined ||
			(groupRole.group() !== null &&
				groupRole.group().id() !== group.id())
		) {
			throw new GroupRoleNotFoundError();
		}

		if (
			command.name &&
			command.name !== null &&
			command.name.length > 0 &&
			command.name !== groupRole.name()
		) {
			const roleExists =
				(await this.groupRoleRepository.findByName(command.name)) !==
				null;

			if (roleExists)
				throw new GroupRoleAlreadyExistsError();

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

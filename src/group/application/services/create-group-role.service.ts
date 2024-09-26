import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { GroupRole } from 'src/group/domain/group-role.model';
import { CreateGroupRoleCommand } from '../ports/in/commands/create-group-role.command';
import { CreateGroupRoleUseCase } from '../ports/in/use-cases/create-group-role.use-case';
import { CreateGroupRoleDto } from '../ports/out/dto/create-group-role.dto';
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
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined) {
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
				GroupPermissionName.CREATE_ROLE,
			)
		) {
			throw new UnauthorizedAccessError();
		}

		let roleExists =
			(await this.groupRoleRepository.findByName(command.name)) !== null;

		if (roleExists) {
			throw new GroupRoleAlreadyExistsError();
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

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} created the role ${groupRole.name()}`,
		);

		this.groupRoleRepository.store(groupRole);
		this.groupRepository.storeLog(log);

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

import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GetGroupRoleCommand } from '../ports/in/commands/get-group-role.command';
import { GetGroupRoleUseCase } from '../ports/in/use-cases/get-group-role.use-case';
import { GetGroupRoleDto } from '../ports/out/dto/get-group-role.dto';
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
import { GroupRoleNotFoundError } from './errors/group-role-not-found.error';

@Injectable()
export class GetGroupRoleService implements GetGroupRoleUseCase {
	constructor(
		@Inject(GroupRoleRepositoryProvider)
		protected groupRoleRepository: GroupRoleRepository,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: GetGroupRoleCommand,
	): Promise<GetGroupRoleDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError(`Group not found`);
		}

		const authenticatedGroupMember =
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUser.id(),
			});

		if (
			authenticatedGroupMember === null ||
			authenticatedGroupMember === undefined
		) {
			throw new UnauthorizedAccessError(
				`You're not a member of the group`,
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

		return new GetGroupRoleDto(
			groupRole.id(),
			group.id(),
			groupRole.name(),
			groupRole.isImmutable(),
			groupRole.hexColor(),
			groupRole.permissions().map((p) => {
				return { id: p.id(), name: p.name() };
			}),
			groupRole.createdAt(),
			groupRole.updatedAt(),
		);
	}
}

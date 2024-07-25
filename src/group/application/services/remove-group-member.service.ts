import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { RemoveGroupMemberCommand } from '../ports/in/commands/remove-group-member.command';
import { RemoveGroupMemberUseCase } from '../ports/in/use-cases/remove-group-member.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GroupMemberNotFoundError } from './errors/group-member-not-found.error';
import { GroupNotFoundError } from './errors/group-not-found.error';

@Injectable()
export class RemoveGroupMemberService implements RemoveGroupMemberUseCase {
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: RemoveGroupMemberCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError(`Group not found`);
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
			throw new UnauthorizedAccessError(
				`You are not a member of the group`,
			);
		}

		if (
			!authenticatedGroupMember.canExecute(
				GroupPermissionName.REMOVE_MEMBER,
			)
		) {
			throw new UnauthorizedAccessError(
				`You don't have permissions to remove members`,
			);
		}

		const groupMember = await this.groupMemberRepository.findById(
			command.id,
		);

		if (groupMember === null || groupMember === undefined) {
			throw new GroupMemberNotFoundError(`Group member not found`);
		}

		this.groupMemberRepository.delete(groupMember.id());

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} removed the member ${groupMember.user().credentials().name()}`,
		);

		this.groupRepository.storeLog(log);
	}
}

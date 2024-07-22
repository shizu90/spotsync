import { Inject, Injectable } from '@nestjs/common';
import { LeaveGroupUseCase } from '../ports/in/use-cases/leave-group.use-case';
import { LeaveGroupCommand } from '../ports/in/commands/leave-group.command';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { UnableToLeaveGroupError } from './errors/unable-to-leave-group.error';
import { GroupLog } from 'src/group/domain/group-log.model';
import { randomUUID } from 'crypto';
import { DefaultGroupRole } from 'src/group/domain/default-group-role.enum';

@Injectable()
export class LeaveGroupService implements LeaveGroupUseCase {
	constructor(
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
	) {}

	public async execute(command: LeaveGroupCommand): Promise<void> {
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.id);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError(`Group not found`);
		}

		const groupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUserId,
			})
		).at(0);

		if (groupMember === null || groupMember === undefined) {
			throw new UnauthorizedAccessError(
				`You are not a member of the group`,
			);
		}

		const groupMembers = await this.groupMemberRepository.findBy({
			groupId: group.id(),
		});

		let hasAdministratorGroupMember = false;

		groupMembers.forEach((gm) => {
			if (gm.role().name() === 'administrator' || gm.isCreator())
				hasAdministratorGroupMember = true;
		});

		if (
			groupMember.isCreator() ||
			(!hasAdministratorGroupMember &&
				groupMember.role().name() === DefaultGroupRole.ADMINISTRATOR)
		) {
			throw new UnableToLeaveGroupError(`Unable to leave group`);
		}

		this.groupMemberRepository.delete(groupMember.id());

		const log = group.newLog(
			`${groupMember.user().credentials().name()} left the group`,
		);

		this.groupRepository.storeLog(log);
	}
}

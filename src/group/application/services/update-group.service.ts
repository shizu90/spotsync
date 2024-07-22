import { Inject, Injectable } from '@nestjs/common';
import { UpdateGroupUseCase } from '../ports/in/use-cases/update-group.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { UpdateGroupCommand } from '../ports/in/commands/update-group.command';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { GroupLog } from 'src/group/domain/group-log.model';
import { randomUUID } from 'crypto';
import { PermissionName } from 'src/group/domain/permission-name.enum';

@Injectable()
export class UpdateGroupService implements UpdateGroupUseCase {
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
	) {}

	public async execute(command: UpdateGroupCommand): Promise<void> {
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.id);

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
				`You are not a member of the group`,
			);
		}

		if (!authenticatedGroupMember.canExecute(PermissionName.UPDATE_SETTINGS)) {
			throw new UnauthorizedAccessError(
				`You don't have permissions to update group settings`,
			);
		}

		if (command.name && command.name !== null && command.name.length > 0) {
			group.changeName(command.name);
		}

		if (
			command.about &&
			command.about !== null &&
			command.about.length > 0
		) {
			group.changeAbout(command.about);
		}

		this.groupRepository.update(group);

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} removed the group settings`,
		);

		this.groupRepository.storeLog(log);
	}
}

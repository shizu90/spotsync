import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { RefuseGroupRequestCommand } from '../ports/in/commands/refuse-group-request.command';
import { RefuseGroupRequestUseCase } from '../ports/in/use-cases/refuse-group-request.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { GroupRequestNotFoundError } from './errors/group-request-not-found.error';

@Injectable()
export class RefuseGroupRequestService implements RefuseGroupRequestUseCase {
	constructor(
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
	) {}

	public async execute(command: RefuseGroupRequestCommand): Promise<void> {
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
				GroupPermissionName.ACCEPT_REQUESTS,
			)
		) {
			throw new UnauthorizedAccessError();
		}

		const groupRequest = (
			await this.groupMemberRepository.findBy({
				id: command.id,
				status: GroupMemberStatus.REQUESTED,
			})
		).at(0);

		if (groupRequest === null || groupRequest === undefined) {
			throw new GroupRequestNotFoundError();
		}

		this.groupMemberRepository.delete(command.id);

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} refused join request of ${groupRequest.user().credentials().name()}`,
		);

		this.groupRepository.storeLog(log);
	}
}

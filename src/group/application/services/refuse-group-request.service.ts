import { Inject, Injectable } from '@nestjs/common';
import { RefuseGroupRequestUseCase } from '../ports/in/use-cases/refuse-group-request.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { RefuseGroupRequestCommand } from '../ports/in/commands/refuse-group-request.command';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupRequestNotFoundError } from './errors/group-request-not-found.error';
import { GroupLog } from 'src/group/domain/group-log.model';
import { randomUUID } from 'crypto';

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
				`You are not a member of the group`,
			);
		}

		const hasPermission = authenticatedGroupMember
			.role()
			.permissions()
			.map((p) => p.name())
			.includes('accept-requests');

		if (
			!(
				hasPermission ||
				authenticatedGroupMember.isCreator() ||
				authenticatedGroupMember.role().name() === 'administrator'
			)
		) {
			throw new UnauthorizedAccessError(
				`You don't have permissions to accept join request`,
			);
		}

		const groupRequest = await this.groupMemberRepository.findRequestById(
			command.id,
		);

		if (groupRequest === null || groupRequest === undefined) {
			throw new GroupRequestNotFoundError(`Group join request not found`);
		}

		this.groupMemberRepository.deleteRequest(command.id);

		const log = GroupLog.create(
			randomUUID(),
			group,
			`${authenticatedGroupMember.user().credentials().name()} refused join request of ${groupRequest.user().credentials().name()}`,
		);

		this.groupRepository.storeLog(log);
	}
}

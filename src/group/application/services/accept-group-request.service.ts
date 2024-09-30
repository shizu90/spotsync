import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { DefaultGroupRole } from 'src/group/domain/default-group-role.enum';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { AcceptGroupRequestCommand } from '../ports/in/commands/accept-group-request.command';
import { AcceptGroupRequestUseCase } from '../ports/in/use-cases/accept-group-request.use-case';
import { GroupMemberDto } from '../ports/out/dto/group-member.dto';
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
import { GroupRequestNotFoundError } from './errors/group-request-not-found.error';

@Injectable()
export class AcceptGroupRequestService implements AcceptGroupRequestUseCase {
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

	public async execute(
		command: AcceptGroupRequestCommand,
	): Promise<GroupMemberDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError();
		}

		const authenticatedGroupMember = (
			await this.groupMemberRepository.findBy({
				groupId: command.id,
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
				GroupPermissionName.ACCEPT_REQUESTS,
			)
		) {
			throw new UnauthorizedAccessError();
		}

		const groupMemberRequest = (
			await this.groupMemberRepository.findBy({
				id: command.id,
				status: GroupMemberStatus.REQUESTED,
			})
		).at(0);

		if (groupMemberRequest === null || groupMemberRequest === undefined) {
			throw new GroupRequestNotFoundError();
		}

		const memberRole = await this.groupRoleRepository.findByName(
			DefaultGroupRole.MEMBER,
		);

		groupMemberRequest.accept();

		await this.groupMemberRepository.update(groupMemberRequest);

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} accepted the join request of ${groupMemberRequest.user().credentials().name()}`,
		);

		this.groupRepository.storeLog(log);

		return GroupMemberDto.fromModel(groupMemberRequest);
	}
}

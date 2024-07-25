import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { DefaultGroupRole } from 'src/group/domain/default-group-role.enum';
import { GroupMemberRequest } from 'src/group/domain/group-member-request.model';
import { GroupMember } from 'src/group/domain/group-member.model';
import { JoinGroupCommand } from '../ports/in/commands/join-group.command';
import { JoinGroupUseCase } from '../ports/in/use-cases/join-group.use-case';
import { AcceptGroupRequestDto } from '../ports/out/dto/accept-group-request.dto';
import { JoinGroupDto } from '../ports/out/dto/join-group.dto';
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
import { AlreadyMemberOfGroup } from './errors/already-member-of-group.error';
import { AlreadyRequestedToJoinError } from './errors/already-requested-to-join.error';

@Injectable()
export class JoinGroupService implements JoinGroupUseCase {
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRoleRepositoryProvider)
		protected groupRoleRepository: GroupRoleRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: JoinGroupCommand,
	): Promise<JoinGroupDto | AcceptGroupRequestDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.id);

		const memberRole = await this.groupRoleRepository.findByName(
			DefaultGroupRole.MEMBER
		);

		const groupMember = group.joinGroup(
			authenticatedUser,
			memberRole,
			false,
		);

		if (groupMember instanceof GroupMemberRequest) {
			let groupMemberRequest = (
				await this.groupMemberRepository.findRequestBy({
					groupId: group.id(),
					userId: authenticatedUser.id(),
				})
			).at(0);

			if (
				groupMemberRequest !== null &&
				groupMemberRequest !== undefined
			) {
				throw new AlreadyRequestedToJoinError(
					`Already requested to join group`,
				);
			}

			this.groupMemberRepository.storeRequest(groupMember);

			const log = group.newLog(
				`${authenticatedUser.credentials().name()} requested to join the group`,
			);

			this.groupRepository.storeLog(log);

			return new JoinGroupDto(
				groupMemberRequest.id(),
				group.id(),
				authenticatedUser.id(),
				groupMemberRequest.requestedOn(),
			);
		} else {
			let groupMember = (
				await this.groupMemberRepository.findBy({
					groupId: group.id(),
					userId: authenticatedUser.id(),
				})
			).at(0);

			if (groupMember !== null && groupMember !== undefined) {
				throw new AlreadyMemberOfGroup(`Already member of the group`);
			}

			groupMember = GroupMember.create(
				randomUUID(),
				group,
				authenticatedUser,
				memberRole,
				false,
			);

			this.groupMemberRepository.store(groupMember);

			const log = group.newLog(
				`${authenticatedUser.credentials().name()} joined the group`,
			);

			this.groupRepository.storeLog(log);

			return new AcceptGroupRequestDto(
				group.id(),
				{
					id: authenticatedUser.id(),
					first_name: authenticatedUser.firstName(),
					last_name: authenticatedUser.lastName(),
					profile_picture: authenticatedUser.profilePicture(),
					banner_picture: authenticatedUser.bannerPicture(),
					credentials: {
						name: authenticatedUser.credentials().name(),
					},
				},
				groupMember.joinedAt(),
				{
					name: memberRole.name(),
					hex_color: memberRole.hexColor(),
					permissions: memberRole.permissions().map((p) => {
						return { id: p.id(), name: p.name() };
					}),
				},
			);
		}
	}
}

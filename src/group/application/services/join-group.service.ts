import { Inject, Injectable } from '@nestjs/common';
import { JoinGroupUseCase } from '../ports/in/use-cases/join-group.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { JoinGroupCommand } from '../ports/in/commands/join-group.command';
import { JoinGroupDto } from '../ports/out/dto/join-group.dto';
import { AcceptGroupRequestDto } from '../ports/out/dto/accept-group-request.dto';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { GroupMemberRequest } from 'src/group/domain/group-member-request.model';
import { randomUUID } from 'crypto';
import { GroupMember } from 'src/group/domain/group-member.model';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../ports/out/group-role.repository';
import { AlreadyRequestedToJoinError } from './errors/already-requested-to-join.error';
import { AlreadyMemberOfGroup } from './errors/already-member-of-group.error';
import { GroupLog } from 'src/group/domain/group-log.model';
import { DefaultGroupRole } from 'src/group/domain/default-group-role.enum';

@Injectable()
export class JoinGroupService implements JoinGroupUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
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
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

		const user = await this.userRepository.findById(authenticatedUserId);

		if (user === null || user === undefined || user.isDeleted()) {
			throw new UserNotFoundError(`User not found`);
		}

		const group = await this.groupRepository.findById(command.id);

		const memberRole = await this.groupRoleRepository.findByName('member');

		const groupMember = group.joinGroup(user, memberRole, false);

		if (groupMember instanceof GroupMemberRequest) {
			let groupMemberRequest = (
				await this.groupMemberRepository.findRequestBy({
					groupId: group.id(),
					userId: authenticatedUserId,
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
				`${user.credentials().name()} requested to join the group`,
			);

			return new JoinGroupDto(
				groupMemberRequest.id(),
				group.id(),
				user.id(),
				groupMemberRequest.requestedOn(),
			);
		} else {
			let groupMember = (
				await this.groupMemberRepository.findBy({
					groupId: group.id(),
					userId: authenticatedUserId,
				})
			).at(0);

			if (groupMember !== null && groupMember !== undefined) {
				throw new AlreadyMemberOfGroup(`Already member of the group`);
			}

			const memberRole = await this.groupRoleRepository.findByName(
				DefaultGroupRole.MEMBER,
			);

			groupMember = GroupMember.create(
				randomUUID(),
				group,
				user,
				memberRole,
				false,
			);

			this.groupMemberRepository.store(groupMember);

			const log = group.newLog(
				`${user.credentials().name()} joined the group`,
			);

			this.groupRepository.storeLog(log);

			return new AcceptGroupRequestDto(
				group.id(),
				{
					id: user.id(),
					first_name: user.firstName(),
					last_name: user.lastName(),
					profile_picture: user.profilePicture(),
					banner_picture: user.bannerPicture(),
					credentials: { name: user.credentials().name() },
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

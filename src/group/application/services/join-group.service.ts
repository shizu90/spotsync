import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { DefaultGroupRole } from 'src/group/domain/default-group-role.enum';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupMember } from 'src/group/domain/group-member.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { JoinGroupCommand } from '../ports/in/commands/join-group.command';
import { JoinGroupUseCase } from '../ports/in/use-cases/join-group.use-case';
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
import { GroupRoleNotFoundError } from './errors/group-role-not-found.error';

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
	): Promise<JoinGroupDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.id);

		const memberRole = await this.groupRoleRepository.findByName(
			DefaultGroupRole.MEMBER,
		);

		if (memberRole === null || memberRole === undefined) {
			throw new GroupRoleNotFoundError(
				`Group role ${DefaultGroupRole.MEMBER} not found`,
			);
		}

		let groupMember = (await this.groupMemberRepository.findBy({
			groupId: group.id(),
			userId: authenticatedUser.id(),
		})).at(0);

		if (groupMember !== null && groupMember !== undefined) {
			if (groupMember.status() === GroupMemberStatus.REQUESTED) {
				throw new AlreadyRequestedToJoinError(
					`Already requested to join group`,
				);
			}

			if (groupMember.status() === GroupMemberStatus.ACTIVE) {
				throw new AlreadyMemberOfGroup(`Already member of the group`);
			}

			groupMember.request();

			this.groupMemberRepository.update(groupMember);
		} else {
			groupMember = GroupMember.create(
				randomUUID(),
				group,
				authenticatedUser,
				memberRole,
				false,
				group.visibilitySettings().groups() === GroupVisibility.PRIVATE ? GroupMemberStatus.REQUESTED : GroupMemberStatus.ACTIVE
			);

			this.groupMemberRepository.store(groupMember);
		}

		let log = null;

		if (group.visibilitySettings().groups() === GroupVisibility.PRIVATE) {
			log = group.newLog(
				`${authenticatedUser.credentials().name()} requested to join the group`,
			);
		} else {
			log = group.newLog(
				`${authenticatedUser.credentials().name()} joined the group`,
			);
		}

		this.groupRepository.storeLog(log);

		return new JoinGroupDto(
			groupMember.id(),
			groupMember.group().id(),
			{
				id: groupMember.user().id(),
				display_name: groupMember.user().profile().displayName(),
				profile_picture: groupMember.user().profile().profilePicture(),
				banner_picture: groupMember.user().profile().bannerPicture(),
				credentials: {
					name: groupMember.user().credentials().name(),
				},
			},
			{
				name: groupMember.role().name(),
				hex_color: groupMember.role().hexColor(),
				permissions: groupMember.role().permissions().map((permission) => {
					return {
						id: permission.id(),
						name: permission.name(),
					};
				}),
			},
			groupMember.joinedAt(),
			groupMember.requestedAt(),
			groupMember.status(),
		)
	}
}

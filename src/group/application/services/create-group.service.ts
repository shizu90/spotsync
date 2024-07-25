import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { DefaultGroupRole } from 'src/group/domain/default-group-role.enum';
import { GroupMember } from 'src/group/domain/group-member.model';
import { GroupVisibilityConfig } from 'src/group/domain/group-visibility-config.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
import { CreateGroupCommand } from '../ports/in/commands/create-group.command';
import { CreateGroupUseCase } from '../ports/in/use-cases/create-group.use-case';
import { CreateGroupDto } from '../ports/out/dto/create-group.dto';
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

@Injectable()
export class CreateGroupService implements CreateGroupUseCase {
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

	public async execute(command: CreateGroupCommand): Promise<CreateGroupDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const adminRole = await this.groupRoleRepository.findByName(
			DefaultGroupRole.ADMINISTRATOR,
		);

		const groupId = randomUUID();

		const group = Group.create(
			groupId,
			command.name,
			command.about,
			null,
			null,
			GroupVisibilityConfig.create(
				groupId,
				GroupVisibility.PUBLIC,
				GroupVisibility.PUBLIC,
				GroupVisibility.PUBLIC,
			),
		);

		const creatorGroupMember = GroupMember.create(
			randomUUID(),
			group,
			authenticatedUser,
			adminRole,
			true,
		);

		await this.groupRepository.store(group);

		this.groupMemberRepository.store(creatorGroupMember);

		return new CreateGroupDto(
			group.id(),
			group.name(),
			group.about(),
			group.groupPicture(),
			group.bannerPicture(),
			{
				post_visibility: group
					.visibilityConfiguration()
					.postVisibility(),
				event_visibility: group
					.visibilityConfiguration()
					.eventVisibility(),
				group_visibility: group
					.visibilityConfiguration()
					.groupVisibility(),
			},
			group.createdAt(),
			group.updatedAt(),
		);
	}
}

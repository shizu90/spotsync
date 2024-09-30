import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { UpdateGroupVisibilityCommand } from '../ports/in/commands/update-group-visibility.command';
import { UpdateGroupVisibilityUseCase } from '../ports/in/use-cases/update-group-visibility.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GroupNotFoundError } from './errors/group-not-found.error';

@Injectable()
export class UpdateGroupVisibilityService
	implements UpdateGroupVisibilityUseCase
{
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: UpdateGroupVisibilityCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.id);

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
				GroupPermissionName.UPDATE_SETTINGS,
			)
		) {
			throw new UnauthorizedAccessError();
		}

		if (
			command.spotEvents &&
			command.spotEvents !== null &&
			command.spotEvents.length > 0
		) {
			group.visibilitySettings().changeSpotEvents(command.spotEvents);
		}

		if (
			command.posts &&
			command.posts !== null &&
			command.posts.length > 0
		) {
			group.visibilitySettings().changePosts(command.posts);
		}

		if (
			command.groups &&
			command.groups !== null &&
			command.groups.length > 0
		) {
			group.visibilitySettings().changeGroups(command.groups);
		}

		this.groupRepository.updateVisibilitySettings(
			group.visibilitySettings(),
		);

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} updated the group visibility`,
		);

		this.groupRepository.storeLog(log);
	}
}

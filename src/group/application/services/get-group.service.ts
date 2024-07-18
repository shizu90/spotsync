import { Inject, Injectable } from '@nestjs/common';
import { GetGroupUseCase } from '../ports/in/use-cases/get-group.use-case';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GetGroupCommand } from '../ports/in/commands/get-group.command';
import { GetGroupDto } from '../ports/out/dto/get-group.dto';
import { GroupNotFoundError } from './errors/group-not-found.error';

@Injectable()
export class GetGroupService implements GetGroupUseCase {
	constructor(
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
	) {}

	public async execute(command: GetGroupCommand): Promise<GetGroupDto> {
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

		const groupMemberRequest = (
			await this.groupMemberRepository.findRequestBy({
				groupId: group.id(),
				userId: authenticatedUserId,
			})
		).at(0);

		return new GetGroupDto(
			group.id(),
			group.name(),
			group.about(),
			group.groupPicture(),
			group.bannerPicture(),
			{
				group_visibility: group
					.visibilityConfiguration()
					.groupVisibility(),
				post_visibility: group
					.visibilityConfiguration()
					.postVisibility(),
				event_visibility: group
					.visibilityConfiguration()
					.eventVisibility(),
			},
			group.createdAt(),
			group.updatedAt(),
			groupMember ? true : false,
			groupMember
				? {
						id: groupMember.id(),
						user_id: groupMember.user().id(),
						is_creator: groupMember.isCreator(),
						joined_at: groupMember.joinedAt(),
						role: {
							id: groupMember.role().id(),
							name: groupMember.role().name(),
							permissions: groupMember
								.role()
								.permissions()
								.map((p) => {
									return { id: p.id(), name: p.name() };
								}),
						},
					}
				: null,
			groupMemberRequest !== null && groupMemberRequest !== undefined
				? groupMemberRequest.requestedOn()
				: null,
		);
	}
}

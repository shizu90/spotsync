import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GetGroupCommand } from '../ports/in/commands/get-group.command';
import { GetGroupUseCase } from '../ports/in/use-cases/get-group.use-case';
import { GroupDto } from '../ports/out/dto/group.dto';
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
export class GetGroupService implements GetGroupUseCase {
	constructor(
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
	) {}

	public async execute(command: GetGroupCommand): Promise<GroupDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.id);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError();
		}

		const groupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUser.id(),
				status: GroupMemberStatus.ACTIVE,
			})
		).at(0);

		const totalMembers = await this.groupMemberRepository.countBy({
			groupId: group.id(),
			status: GroupMemberStatus.ACTIVE,
		});

		return GroupDto.fromModel(group).setGroupMember(groupMember).setTotalMembers(totalMembers);
	}
}

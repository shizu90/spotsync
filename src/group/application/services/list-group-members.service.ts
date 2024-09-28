import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { ListGroupMembersCommand } from '../ports/in/commands/list-group-members.command';
import { ListGroupMembersUseCase } from '../ports/in/use-cases/list-group-members.use-case';
import { GroupMemberDto } from '../ports/out/dto/group-member.dto';
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
export class ListGroupMembersService implements ListGroupMembersUseCase {
	constructor(
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
	) {}

	public async execute(
		command: ListGroupMembersCommand,
	): Promise<Pagination<GroupMemberDto> | Array<GroupMemberDto>> {
		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError();
		}

		if (
			group.visibilitySettings().groups() === GroupVisibility.PRIVATE
		) {
			throw new UnauthorizedAccessError();
		} else {
			const pagination = await this.groupMemberRepository.paginate({
				filters: {
					groupId: command.groupId,
					name: command.name,
					roleId: command.roleId,
					status: command.status,
				},
				sort: command.sort,
				sortDirection: command.sortDirection,
				paginate: command.paginate,
				page: command.page,
				limit: command.limit,
			});

			const items = pagination.items.map((gm) => {
				return GroupMemberDto.fromModel(gm);
			});

			if (!command.paginate) {
				return items;
			}

			return new Pagination(
				items,
				pagination.total,
				pagination.current_page,
				pagination.limit,
			);
		}
	}
}

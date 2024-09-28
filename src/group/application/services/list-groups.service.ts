import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { ListGroupsCommand } from '../ports/in/commands/list-groups.command';
import { ListGroupsUseCase } from '../ports/in/use-cases/list-groups.use-case';
import { GroupDto } from '../ports/out/dto/group.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';

@Injectable()
export class ListGroupsService implements ListGroupsUseCase {
	constructor(
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
	) {}

	public async execute(
		command: ListGroupsCommand,
	): Promise<Pagination<GroupDto> | Array<GroupDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const pagination = await this.groupRepository.paginate({
			filters: {
				name: command.name,
				visibility: command.groupVisibility,
				is_deleted: false,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			page: command.page,
			paginate: command.paginate,
			limit: command.limit,
		});

		const items = await Promise.all(
			pagination.items.map(async (g) => {
				if (g === null || g === undefined) return null;

				const groupMember = (
					await this.groupMemberRepository.findBy({
						groupId: g.id(),
						userId: authenticatedUser.id(),
						status: GroupMemberStatus.ACTIVE,
					})
				).at(0);

				return GroupDto.fromModel(g)
					.setGroupMember(groupMember);
			}),
		);

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { ListGroupMembersUseCase } from '../ports/in/use-cases/list-group-members.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import { ListGroupMembersCommand } from '../ports/in/commands/list-group-members.command';
import { GetGroupMemberDto } from '../ports/out/dto/get-group-member.dto';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { Pagination } from 'src/common/common.repository';

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
	): Promise<Pagination<GetGroupMemberDto>> {
		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError(`Group not found`);
		}

		if (group.visibilityConfiguration().groupVisibility() === 'PRIVATE') {
			return new Pagination([], 0, 0);
		} else {
			const pagination = await this.groupMemberRepository.paginate({
				filters: {
					groupId: command.groupId,
					name: command.name,
					roleId: command.roleId,
				},
				sort: command.sort,
				sortDirection: command.sortDirection,
				paginate: command.paginate,
				page: command.page,
				limit: command.limit,
			});

			const items = pagination.items.map((gm) => {
				return new GetGroupMemberDto(
					gm.id(),
					{
						id: gm.user().id(),
						banner_picture: gm.user().bannerPicture(),
						profile_picture: gm.user().profilePicture(),
						credentials: { name: gm.user().credentials().name() },
					},
					gm.group().id(),
					{
						id: gm.role().id(),
						name: gm.role().name(),
						hex_color: gm.role().hexColor(),
						permissions: gm
							.role()
							.permissions()
							.map((p) => {
								return { id: p.id(), name: p.name() };
							}),
					},
					gm.joinedAt(),
					gm.isCreator(),
				);
			});

			return new Pagination(
				items,
				pagination.total,
				pagination.current_page,
			);
		}
	}
}

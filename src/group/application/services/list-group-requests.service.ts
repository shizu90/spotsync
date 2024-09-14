import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
import { ListGroupRequestsCommand } from '../ports/in/commands/list-group-requests.command';
import { ListGroupRequestsUseCase } from '../ports/in/use-cases/list-group-requests.use-case';
import { GetGroupRequestDto } from '../ports/out/dto/get-group-request.dto';
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
export class ListGroupRequestsService implements ListGroupRequestsUseCase {
	constructor(
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListGroupRequestsCommand,
	): Promise<Pagination<GetGroupRequestDto> | Array<GetGroupRequestDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError(`Group not found`);
		}

		const authenticatedGroupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUser.id(),
			})
		).at(0);

		if (
			authenticatedGroupMember === null ||
			authenticatedGroupMember === undefined
		) {
			throw new UnauthorizedAccessError(
				`You're not a member of the group`,
			);
		}

		const pagination = await this.groupMemberRepository.paginateRequest({
			filters: {
				name: command.name,
				groupId: command.groupId,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			paginate: command.paginate,
			page: command.page,
			limit: command.limit,
		});

		const items = pagination.items.map((item) => {
			return new GetGroupRequestDto(
				item.id(),
				{
					id: item.user().id(),
					first_name: item.user().firstName(),
					last_name: item.user().lastName(),
					profile_picture: item.user().profilePicture(),
					banner_picture: item.user().bannerPicture(),
					credentials: { name: item.user().credentials().name() },
				},
				item.group().id(),
				item.requestedOn(),
			);
		});

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { GetGroupHistoryUseCase } from '../ports/in/use-cases/get-group-history.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { GetGroupHistoryCommand } from '../ports/in/commands/get-group-history.command';
import { GetGroupLogDto } from '../ports/out/dto/get-group-log.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import { GroupNotFoundError } from './errors/group-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/common.repository';

@Injectable()
export class GetGroupHistoryService implements GetGroupHistoryUseCase {
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: GetGroupHistoryCommand,
	): Promise<Pagination<GetGroupLogDto>> {
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.groupId);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError(`Group not found`);
		}

		const authenticatedGroupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUserId,
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

		const pagination = await this.groupRepository.paginateLog({
			filters: { groupId: command.groupId },
			sort: command.sort,
			sortDirection: command.sortDirection,
			paginate: command.paginate,
			page: command.page,
			limit: command.limit,
		});

		const items = pagination.items.map((log) => {
			return new GetGroupLogDto(
				log.id(),
				log.text(),
				log.group().id(),
				log.occurredAt(),
			);
		});

		return new Pagination(items, pagination.total, pagination.current_page);
	}
}

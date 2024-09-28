import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GroupMemberDto } from '../../out/dto/group-member.dto';
import { ListGroupMembersCommand } from '../commands/list-group-members.command';

export const ListGroupMembersUseCaseProvider = 'ListGroupMembersUseCase';

export interface ListGroupMembersUseCase
	extends UseCase<
		ListGroupMembersCommand,
		Promise<Pagination<GroupMemberDto> | Array<GroupMemberDto>>
	> {}

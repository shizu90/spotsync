import { UseCase } from 'src/common/common.use-case';
import { ListGroupMembersCommand } from '../commands/list-group-members.command';
import { GetGroupMemberDto } from '../../out/dto/get-group-member.dto';
import { Pagination } from 'src/common/common.repository';

export const ListGroupMembersUseCaseProvider = 'ListGroupMembersUseCase';

export interface ListGroupMembersUseCase
	extends UseCase<
		ListGroupMembersCommand,
		Promise<Pagination<GetGroupMemberDto>>
	> {}

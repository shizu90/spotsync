import { Repository } from 'src/common/core/common.repository';
import { GroupMember } from 'src/group/domain/group-member.model';

export const GroupMemberRepositoryProvider = 'GroupMemberRepository';

export interface GroupMemberRepository
	extends Repository<GroupMember, string> {}

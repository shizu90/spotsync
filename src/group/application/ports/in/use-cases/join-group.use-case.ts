import { UseCase } from 'src/common/core/common.use-case';
import { GroupMemberDto } from '../../out/dto/group-member.dto';
import { JoinGroupCommand } from '../commands/join-group.command';

export const JoinGroupUseCaseProvider = 'JoinGroupUseCase';

export interface JoinGroupUseCase
	extends UseCase<
		JoinGroupCommand,
		Promise<GroupMemberDto>
	> {}

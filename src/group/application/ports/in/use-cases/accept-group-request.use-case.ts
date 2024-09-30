import { UseCase } from 'src/common/core/common.use-case';
import { GroupMemberDto } from '../../out/dto/group-member.dto';
import { AcceptGroupRequestCommand } from '../commands/accept-group-request.command';

export const AcceptGroupRequestUseCaseProvider = 'AcceptGroupRequestUseCase';

export interface AcceptGroupRequestUseCase
	extends UseCase<AcceptGroupRequestCommand, Promise<GroupMemberDto>> {}

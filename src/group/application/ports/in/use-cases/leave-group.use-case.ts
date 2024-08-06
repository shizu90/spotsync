import { UseCase } from 'src/common/core/common.use-case';
import { LeaveGroupCommand } from '../commands/leave-group.command';

export const LeaveGroupUseCaseProvider = 'LeaveGroupUseCase';

export interface LeaveGroupUseCase
	extends UseCase<LeaveGroupCommand, Promise<void>> {}

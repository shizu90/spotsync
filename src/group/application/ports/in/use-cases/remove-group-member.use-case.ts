import { UseCase } from 'src/common/common.use-case';
import { RemoveGroupMemberCommand } from '../commands/remove-group-member.command';

export const RemoveGroupMemberUseCaseProvider = 'RemoveGroupMemberUseCase';

export interface RemoveGroupMemberUseCase
  extends UseCase<RemoveGroupMemberCommand, Promise<void>> {}

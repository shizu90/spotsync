import { UseCase } from 'src/common/common.use-case';
import { ChangeMemberRoleCommand } from '../commands/change-member-role.command';

export const ChangeMemberRoleUseCaseProvider = 'ChangeMemberRoleUseCase';

export interface ChangeMemberRoleUseCase
  extends UseCase<ChangeMemberRoleCommand, Promise<void>> {}

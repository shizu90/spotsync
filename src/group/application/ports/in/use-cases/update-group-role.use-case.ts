import { UseCase } from 'src/common/common.use-case';
import { UpdateGroupRoleCommand } from '../commands/update-group-role.command';

export const UpdateGroupRoleUseCaseProvider = 'UpdateGroupRoleUseCae';

export interface UpdateGroupRoleUseCase
  extends UseCase<UpdateGroupRoleCommand, Promise<void>> {}
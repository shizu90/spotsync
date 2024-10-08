import { UseCase } from 'src/common/core/common.use-case';
import { RemoveGroupRoleCommand } from '../commands/remove-group-role.command';

export const RemoveGroupRoleUseCaseProvider = 'RemoveGroupRoleUseCase';

export interface RemoveGroupRoleUseCase
	extends UseCase<RemoveGroupRoleCommand, Promise<void>> {}

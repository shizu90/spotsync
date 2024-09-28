import { UseCase } from 'src/common/core/common.use-case';
import { GroupRoleDto } from '../../out/dto/group-role.dto';
import { CreateGroupRoleCommand } from '../commands/create-group-role.command';

export const CreateGroupRoleUseCaseProvider = 'CreateGroupRoleUseCase';

export interface CreateGroupRoleUseCase
	extends UseCase<CreateGroupRoleCommand, Promise<GroupRoleDto>> {}

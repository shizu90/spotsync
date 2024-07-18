import { UseCase } from 'src/common/common.use-case';
import { CreateGroupRoleCommand } from '../commands/create-group-role.command';
import { CreateGroupRoleDto } from '../../out/dto/create-group-role.dto';

export const CreateGroupRoleUseCaseProvider = 'CreateGroupRoleUseCase';

export interface CreateGroupRoleUseCase
	extends UseCase<CreateGroupRoleCommand, Promise<CreateGroupRoleDto>> {}

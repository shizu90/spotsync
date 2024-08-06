import { UseCase } from 'src/common/core/common.use-case';
import { GetGroupRoleDto } from '../../out/dto/get-group-role.dto';
import { GetGroupRoleCommand } from '../commands/get-group-role.command';

export const GetGroupRoleUseCaseProvider = 'GetGroupRoleUseCase';

export interface GetGroupRoleUseCase
	extends UseCase<GetGroupRoleCommand, Promise<GetGroupRoleDto>> {}

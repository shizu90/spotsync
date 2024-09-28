import { UseCase } from 'src/common/core/common.use-case';
import { GroupDto } from '../../out/dto/group.dto';
import { GetGroupCommand } from '../commands/get-group.command';

export const GetGroupUseCaseProvider = 'GetGroupUseCase';

export interface GetGroupUseCase
	extends UseCase<GetGroupCommand, Promise<GroupDto>> {}

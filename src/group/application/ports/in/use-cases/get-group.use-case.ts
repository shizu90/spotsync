import { UseCase } from 'src/common/core/common.use-case';
import { GetGroupDto } from '../../out/dto/get-group.dto';
import { GetGroupCommand } from '../commands/get-group.command';

export const GetGroupUseCaseProvider = 'GetGroupUseCase';

export interface GetGroupUseCase
	extends UseCase<GetGroupCommand, Promise<GetGroupDto>> {}

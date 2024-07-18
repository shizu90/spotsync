import { UseCase } from 'src/common/common.use-case';
import { GetGroupCommand } from '../commands/get-group.command';
import { GetGroupDto } from '../../out/dto/get-group.dto';

export const GetGroupUseCaseProvider = 'GetGroupUseCase';

export interface GetGroupUseCase
	extends UseCase<GetGroupCommand, Promise<GetGroupDto>> {}

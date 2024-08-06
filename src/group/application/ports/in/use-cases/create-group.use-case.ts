import { UseCase } from 'src/common/core/common.use-case';
import { CreateGroupDto } from '../../out/dto/create-group.dto';
import { CreateGroupCommand } from '../commands/create-group.command';

export const CreateGroupUseCaseProvider = 'CreateGroupUseCase';

export interface CreateGroupUseCase
	extends UseCase<CreateGroupCommand, Promise<CreateGroupDto>> {}

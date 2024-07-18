import { UseCase } from 'src/common/common.use-case';
import { CreateGroupCommand } from '../commands/create-group.command';
import { CreateGroupDto } from '../../out/dto/create-group.dto';

export const CreateGroupUseCaseProvider = 'CreateGroupUseCase';

export interface CreateGroupUseCase
	extends UseCase<CreateGroupCommand, Promise<CreateGroupDto>> {}

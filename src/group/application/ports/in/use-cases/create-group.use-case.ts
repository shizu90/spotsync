import { UseCase } from 'src/common/core/common.use-case';
import { GroupDto } from '../../out/dto/group.dto';
import { CreateGroupCommand } from '../commands/create-group.command';

export const CreateGroupUseCaseProvider = 'CreateGroupUseCase';

export interface CreateGroupUseCase
	extends UseCase<CreateGroupCommand, Promise<GroupDto>> {}

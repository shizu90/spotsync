import { UseCase } from 'src/common/common.use-case';
import { JoinGroupCommand } from '../commands/join-group.command';
import { JoinGroupDto } from '../../out/dto/join-group.dto';
import { AcceptGroupRequestDto } from '../../out/dto/accept-group-request.dto';

export const JoinGroupUseCaseProvider = 'JoinGroupUseCase';

export interface JoinGroupUseCase
	extends UseCase<
		JoinGroupCommand,
		Promise<JoinGroupDto | AcceptGroupRequestDto>
	> {}

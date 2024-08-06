import { UseCase } from 'src/common/core/common.use-case';
import { AcceptGroupRequestDto } from '../../out/dto/accept-group-request.dto';
import { JoinGroupDto } from '../../out/dto/join-group.dto';
import { JoinGroupCommand } from '../commands/join-group.command';

export const JoinGroupUseCaseProvider = 'JoinGroupUseCase';

export interface JoinGroupUseCase
	extends UseCase<
		JoinGroupCommand,
		Promise<JoinGroupDto | AcceptGroupRequestDto>
	> {}

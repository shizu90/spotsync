import { UseCase } from 'src/common/core/common.use-case';
import { JoinGroupDto } from '../../out/dto/join-group.dto';
import { AcceptGroupRequestCommand } from '../commands/accept-group-request.command';

export const AcceptGroupRequestUseCaseProvider = 'AcceptGroupRequestUseCase';

export interface AcceptGroupRequestUseCase
	extends UseCase<
		AcceptGroupRequestCommand,
		Promise<JoinGroupDto>
	> {}

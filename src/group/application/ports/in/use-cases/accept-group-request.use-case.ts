import { UseCase } from 'src/common/core/common.use-case';
import { AcceptGroupRequestDto } from '../../out/dto/accept-group-request.dto';
import { AcceptGroupRequestCommand } from '../commands/accept-group-request.command';

export const AcceptGroupRequestUseCaseProvider = 'AcceptGroupRequestUseCase';

export interface AcceptGroupRequestUseCase
	extends UseCase<
		AcceptGroupRequestCommand,
		Promise<AcceptGroupRequestDto>
	> {}
